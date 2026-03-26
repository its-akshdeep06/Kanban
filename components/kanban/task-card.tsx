"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2, Calendar, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Task, Priority } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onClick: (task: Task) => void
  isMobile?: boolean
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDeadline(timestamp: number): { text: string; isOverdue: boolean; isToday: boolean } {
  const deadline = new Date(timestamp)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)

  const diff = deadline.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < 0) return { text: `${Math.abs(days)}d overdue`, isOverdue: true, isToday: false }
  if (days === 0) return { text: "Due today", isOverdue: false, isToday: true }
  if (days === 1) return { text: "Due tomorrow", isOverdue: false, isToday: false }
  if (days < 7) return { text: `Due in ${days}d`, isOverdue: false, isToday: false }

  return {
    text: deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: false,
    isToday: false
  }
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  high: {
    label: "High",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  },
}

export function TaskCard({ task, onEdit, onDelete, onClick, isMobile = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    ...(task.color ? { borderLeftColor: task.color, borderLeftWidth: '4px' } : {})
  }

  const priority = priorityConfig[task.priority]
  const deadlineInfo = task.deadline ? formatDeadline(task.deadline) : null

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      className={cn(
        "group relative bg-white dark:bg-card border border-border cursor-pointer",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "hover:border-primary/30",
        isMobile ? "p-3.5" : "p-4",
        isDragging && "opacity-40 rotate-2 scale-105 shadow-xl z-50 cursor-grabbing"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "mt-1 p-1 rounded text-muted-foreground/40 hover:text-muted-foreground/60",
            "hover:bg-muted/40 transition-colors cursor-grab active:cursor-grabbing shrink-0",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "touch-manipulation", "opacity-0 group-hover:opacity-100"
          )}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-semibold text-foreground leading-snug break-words",
              isMobile ? "text-sm" : "text-sm",
              task.columnId === "done" && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>

            {/* Actions - visible on hover or always on mobile */}
            <div className={cn(
              "flex items-center gap-0.5 shrink-0 transition-opacity",
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
                aria-label="Edit task"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
                aria-label="Delete task"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className={cn(
              "mt-1 text-muted-foreground line-clamp-2 leading-relaxed",
              isMobile ? "text-xs" : "text-xs"
            )}>
              {task.description}
            </p>
          )}

          {/* Footer: Priority, dates, deadline */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className={cn("text-xs px-1.5 py-0 h-5 font-medium border", priority.className)}
            >
              {priority.label}
            </Badge>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.createdAt)}</span>
            </div>

            {deadlineInfo && (
              <div className={cn(
                "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded",
                deadlineInfo.isOverdue
                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                  : deadlineInfo.isToday
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  : "text-muted-foreground"
              )}>
                <Clock className="h-3 w-3" />
                <span>{deadlineInfo.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
