"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { Search, Moon, Sun, Layers, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"
import { TaskDialog } from "./task-dialog"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { NotesSection } from "./notes-section"
import { useKanban } from "@/hooks/use-kanban"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Task, ColumnId, Priority } from "@/lib/types"
import { COLUMN_CONFIG } from "@/lib/types"
import { cn } from "@/lib/utils"

const COLUMNS: ColumnId[] = ["todo", "in-progress", "done"]

interface KanbanBoardProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function KanbanBoard({ isDarkMode, onToggleTheme }: KanbanBoardProps) {
  const {
    isLoaded,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasksInColumn,
    deleteAllTasks,
    moveTask,
    getTasksByColumn,
  } = useKanban()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [targetColumn, setTargetColumn] = useState<ColumnId>("todo")
  const [activeColumn, setActiveColumn] = useState<ColumnId>("todo")
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "task" | "column" | "all"
    id?: string
    columnId?: ColumnId
  } | null>(null)
  const isMobile = useIsMobile()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const task = active.data.current?.task as Task | undefined
    if (task) setActiveTask(task)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveTask(null)
      if (!over) return
      const taskId = active.id as string
      const newColumnId = over.id as ColumnId
      if (COLUMNS.includes(newColumnId)) {
        moveTask(taskId, newColumnId)
      }
    },
    [moveTask]
  )

  const handleAddTask = useCallback((columnId: ColumnId = "todo") => {
    setEditingTask(null)
    setTargetColumn(columnId)
    setIsDialogOpen(true)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }, [])

  const handleSaveTask = useCallback(
    (title: string, description: string, priority: Priority, columnId: ColumnId, color?: string, deadline?: number) => {
      addTask(title, description, priority, columnId, color, deadline)
    },
    [addTask]
  )

  const handleUpdateTask = useCallback(
    (id: string, title: string, description: string, priority: Priority, columnId: ColumnId, color?: string, deadline?: number) => {
      updateTask(id, { title, description, priority, columnId, color, deadline })
    },
    [updateTask]
  )

  const handleTaskClick = useCallback((task: Task) => {
    setDetailTask(task)
  }, [])

  const handleDeleteTaskRequest = useCallback((id: string) => {
    setDeleteConfirm({ type: "task", id })
  }, [])

  const handleDeleteAllRequest = useCallback((columnId: ColumnId) => {
    setDeleteConfirm({ type: "column", columnId })
  }, [])

  const handleClearAllRequest = useCallback(() => {
    setDeleteConfirm({ type: "all" })
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (deleteConfirm?.type === "task" && deleteConfirm.id) {
      deleteTask(deleteConfirm.id)
    } else if (deleteConfirm?.type === "column" && deleteConfirm.columnId) {
      deleteAllTasksInColumn(deleteConfirm.columnId)
    } else if (deleteConfirm?.type === "all") {
      deleteAllTasks()
    }
    setDeleteConfirm(null)
  }, [deleteConfirm, deleteTask, deleteAllTasksInColumn, deleteAllTasks])

  const handleDeleteFromDialog = useCallback((id: string) => {
    setIsDialogOpen(false)
    setDeleteConfirm({ type: "task", id })
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-16 gap-4">

            {/* Logo & Title */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 shadow-inner">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Kanban
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xs sm:max-w-md mx-3 sm:mx-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-full text-sm bg-transparent border-border/80 text-foreground placeholder:text-muted-foreground focus:border-border transition-colors rounded-[8px]"
                />
              </div>
            </div>

            {/* Clear All & Theme Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearAllRequest}
                className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[8px] transition-colors"
                aria-label="Clear all tasks"
                title="Clear all tasks"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                className="h-10 w-10 text-muted-foreground hover:bg-secondary rounded-[8px] transition-colors"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 sm:h-5 sm:w-5 text-amber-400 hover:text-amber-500 transition-colors" />
                ) : (
                  <Moon className="h-5 w-5 sm:h-5 sm:w-5 text-indigo-500 hover:text-indigo-600 transition-colors" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Column Tabs ── */}
      {isMobile && (
        <div className="sticky top-16 z-30 bg-background border-b border-border">
          <div className="flex">
            {COLUMNS.map((columnId) => {
              const config = COLUMN_CONFIG[columnId]
              const taskCount = getTasksByColumn(columnId).length
              const isActive = activeColumn === columnId
              return (
                <button
                  key={columnId}
                  onClick={() => setActiveColumn(columnId)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? cn("border-b-2 border-primary text-primary bg-primary/5")
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", config.dotColor)} />
                  {config.title}
                  <span className={cn(
                    "flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-semibold",
                    isActive ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  )}>
                    {taskCount}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Board ── */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 overflow-hidden flex flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {isMobile ? (
            /* Mobile: single column */
            <div className="h-full">
              <KanbanColumn
                columnId={activeColumn}
                tasks={getTasksByColumn(activeColumn)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTaskRequest}
                onDeleteAll={handleDeleteAllRequest}
                onTaskClick={handleTaskClick}
                isMobile
              />
            </div>
          ) : (
            /* Desktop: 3 columns */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full">
              {COLUMNS.map((columnId) => (
                <KanbanColumn
                  key={columnId}
                  columnId={columnId}
                  tasks={getTasksByColumn(columnId)}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTaskRequest}
                  onDeleteAll={handleDeleteAllRequest}
                  onTaskClick={handleTaskClick}
                />
              ))}
            </div>
          )}

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeTask ? (
              <div className="w-72 sm:w-80 rotate-2 opacity-95 shadow-2xl">
                <TaskCard
                  task={activeTask}
                  onEdit={() => { }}
                  onDelete={() => { }}
                  onClick={() => { }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* ── Notes Section ── */}
      <div className="shrink-0 bg-background border-t border-border">
        <NotesSection />
      </div>

      {/* ── Task Dialog ── */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        targetColumn={targetColumn}
        onSave={handleSaveTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteFromDialog}
      />

      {/* ── Delete Confirmation ── */}
      <DeleteConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title={
          deleteConfirm?.type === "all"
            ? "Clear All Tasks"
            : deleteConfirm?.type === "column"
            ? "Delete All Tasks"
            : "Delete Task"
        }
        description={
          deleteConfirm?.type === "all"
            ? "Are you sure you want to clear all tasks from all columns? This action cannot be undone."
            : deleteConfirm?.type === "column"
            ? `Are you sure you want to delete all tasks in the "${deleteConfirm.columnId ? COLUMN_CONFIG[deleteConfirm.columnId].title : ""}" column? This action cannot be undone.`
            : "Are you sure you want to delete this task? This action cannot be undone."
        }
        onConfirm={handleConfirmDelete}
      />

      {/* ── Task Detail Dialog ── */}
      {detailTask && (
        <TaskDialog
          open={!!detailTask}
          onOpenChange={(open) => !open && setDetailTask(null)}
          task={detailTask}
          targetColumn={detailTask.columnId}
          onSave={handleSaveTask}
          onUpdate={handleUpdateTask}
          onDelete={(id) => {
            setDetailTask(null)
            setDeleteConfirm({ type: "task", id })
          }}
          isDetailView
        />
      )}
    </div>
  )
}
