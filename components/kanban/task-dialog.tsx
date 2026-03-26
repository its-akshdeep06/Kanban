"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task, Priority, ColumnId } from "@/lib/types"
import { COLUMN_CONFIG } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  targetColumn?: ColumnId
  onSave: (title: string, description: string, priority: Priority, columnId: ColumnId, color?: string, deadline?: number) => void
  onUpdate?: (id: string, title: string, description: string, priority: Priority, columnId: ColumnId, color?: string, deadline?: number) => void
  onDelete?: (id: string) => void
  isDetailView?: boolean
}

const TASK_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
]

export function TaskDialog({
  open,
  onOpenChange,
  task,
  targetColumn = "todo",
  onSave,
  onUpdate,
  onDelete,
  isDetailView = false,
}: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [color, setColor] = useState<string>("")
  const [columnId, setColumnId] = useState<ColumnId>(targetColumn)
  const [deadline, setDeadline] = useState<string>("")

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setColor(task.color || "")
      setColumnId(task.columnId)
      setDeadline(
        task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : ""
      )
    } else {
      setTitle("")
      setDescription("")
      setPriority("medium")
      setColor("")
      setColumnId(targetColumn)
      setDeadline("")
    }
  }, [task, open, targetColumn])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const deadlineTimestamp = deadline ? new Date(deadline).getTime() : undefined

    if (isEditing && task && onUpdate) {
      onUpdate(task.id, title.trim(), description.trim(), priority, columnId, color, deadlineTimestamp)
    } else {
      onSave(title.trim(), description.trim(), priority, columnId, color, deadlineTimestamp)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[425px] bg-card border-border mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isDetailView ? "Task Details" : isEditing ? "Edit Task" : `Add Task`}
          </DialogTitle>
          <DialogDescription>
            {isDetailView
              ? "View and edit task details below."
              : isEditing
              ? "Update the task details below."
              : "Fill in the details for your new task."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-foreground">
                Priority
              </Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="low" className="text-primary">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="text-amber-400">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-destructive">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="column" className="text-foreground">
                Column
              </Label>
              <Select value={columnId} onValueChange={(val) => setColumnId(val as ColumnId)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-foreground">
              Deadline{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">Task Color (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {TASK_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${color === c.value ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
                    }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  aria-label={`Set color to ${c.name}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-2 pt-2">
            <div className="flex gap-2 w-full sm:w-auto">
              {isEditing && task && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onDelete(task.id)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isEditing ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
