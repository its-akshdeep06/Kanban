"use client"

import { useState, useEffect, useCallback } from "react"
import type { Task, ColumnId, Priority } from "@/lib/types"

const STORAGE_KEY = "kanban-tasks"

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Handle storage errors silently
  }
}

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Load tasks from localStorage on mount
  useEffect(() => {
    setTasks(loadTasks())
    setIsLoaded(true)
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks)
    }
  }, [tasks, isLoaded])

  const addTask = useCallback(
    (title: string, description: string, priority: Priority, columnId: ColumnId = "todo", color?: string, deadline?: number) => {
      const newTask: Task = {
        id: generateId(),
        title,
        description,
        priority,
        columnId,
        color,
        createdAt: Date.now(),
        deadline,
      }
      setTasks((prev) => [...prev, newTask])
    },
    []
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      )
    },
    []
  )

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const deleteAllTasksInColumn = useCallback((columnId: ColumnId) => {
    setTasks((prev) => prev.filter((task) => task.columnId !== columnId))
  }, [])

  const deleteAllTasks = useCallback(() => {
    setTasks([])
  }, [])

  const moveTask = useCallback((taskId: string, newColumnId: ColumnId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, columnId: newColumnId } : task
      )
    )
  }, [])

  const getTasksByColumn = useCallback(
    (columnId: ColumnId) => {
      return tasks
        .filter((task) => {
          const matchesColumn = task.columnId === columnId
          const matchesSearch =
            searchQuery === "" ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
          return matchesColumn && matchesSearch
        })
        .sort((a, b) => {
          const priorityWeight = { high: 0, medium: 1, low: 2 }
          if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
            return priorityWeight[a.priority] - priorityWeight[b.priority]
          }
          return a.createdAt - b.createdAt
        })
    },
    [tasks, searchQuery]
  )

  return {
    tasks,
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
  }
}
