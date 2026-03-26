"use client"

import { useState, useEffect } from "react"
import { KanbanBoard } from "@/components/kanban/kanban-board"

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Check for saved preference or default to dark
    const savedTheme = localStorage.getItem("kanban-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark

    setIsDarkMode(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev
      localStorage.setItem("kanban-theme", newValue ? "dark" : "light")
      document.documentElement.classList.toggle("dark", newValue)
      return newValue
    })
  }

  return <KanbanBoard isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
}
