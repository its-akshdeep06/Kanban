export type Priority = "low" | "medium" | "high"

export type ColumnId = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  columnId: ColumnId
  color?: string
  createdAt: number
  deadline?: number
}

export interface Column {
  id: ColumnId
  title: string
  tasks: Task[]
}

export const COLUMN_CONFIG: Record<
  ColumnId,
  {
    title: string
    dotColor: string
  }
> = {
  todo: {
    title: "To Do",
    dotColor: "bg-slate-400",
  },
  "in-progress": {
    title: "In Progress",
    dotColor: "bg-slate-400",
  },
  done: {
    title: "Done",
    dotColor: "bg-slate-400",
  },
}
