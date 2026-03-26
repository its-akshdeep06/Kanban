"use client"

import { useDroppable } from "@dnd-kit/core"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "./task-card"
import type { Task, ColumnId } from "@/lib/types"
import { COLUMN_CONFIG } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  columnId: ColumnId
  tasks: Task[]
  onAddTask: (columnId: ColumnId) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onDeleteAll: (columnId: ColumnId) => void
  onTaskClick: (task: Task) => void
  isMobile?: boolean
}

export function KanbanColumn({
  columnId,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteAll,
  onTaskClick,
  isMobile = false,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  })

  const config = COLUMN_CONFIG[columnId]
  const hasHighPriority = tasks.some(t => t.priority === "high")
  const hasTasks = tasks.length > 0
  const dotColorClass = hasHighPriority 
    ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" 
    : hasTasks 
    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
    : config.dotColor

  return (
    <div
      className={cn(
        "flex flex-col rounded-[14px] border border-border/60 bg-card relative",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none",
        "transition-all duration-200",
        isMobile ? "h-full min-h-0 border-0 bg-transparent rounded-none shadow-none" : "h-[600px] flex flex-col",
        isOver && "ring-2 ring-primary/40 bg-card/90"
      )}
    >
      {/* Column Header */}
      {!isMobile && (
        <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-border/40 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={cn("w-3 h-3 rounded-full transition-colors flex-shrink-0", dotColorClass)} />
            <h2 className="font-semibold text-sm tracking-wide text-foreground truncate">
              {config.title}
            </h2>
            <span className="flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground/80 flex-shrink-0">
              {tasks.length}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors rounded-md"
              onClick={() => onAddTask(columnId)}
              aria-label={`Add task to ${config.title}`}
              title="Add task"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-md"
              onClick={() => onDeleteAll(columnId)}
              disabled={tasks.length === 0}
              aria-label={`Delete all tasks in ${config.title}`}
              title="Delete all tasks"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Tasks Area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-3 p-3 flex-1 overflow-y-auto min-h-[80px]",
          isMobile ? "gap-3 pb-24" : "",
          isOver && "bg-primary/5 rounded-b-[14px]"
        )}
      >
        {tasks.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-start justify-start text-left py-4 px-0",
              isMobile ? "py-16" : ""
            )}
          >
            <p className="text-sm text-muted-foreground mb-3">No tasks in {config.title}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-primary font-medium hover:text-primary hover:bg-primary/10"
              onClick={() => onAddTask(columnId)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add a task
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onClick={onTaskClick}
              isMobile={isMobile}
            />
          ))
        )}
      </div>
    </div>
  )
}
