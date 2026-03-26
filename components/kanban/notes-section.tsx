"use client"

import { useState, useEffect } from "react"
import { StickyNote, ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NOTES_STORAGE_KEY = "kanban-notes"

export function NotesSection() {
  const [notes, setNotes] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(NOTES_STORAGE_KEY)
      if (stored) {
        setNotes(stored)
      }
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(NOTES_STORAGE_KEY, notes)
    }
  }, [notes, isLoaded])

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0
  const charCount = notes.length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notes)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleClear = () => {
    if (notes && confirm("Are you sure you want to clear all notes?")) {
      setNotes("")
    }
  }

  return (
    <div className="border-t border-border bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm text-foreground">Quick Notes</span>
          {notes && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-xs font-medium text-primary">
              {wordCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-primary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary" />
          )}
        </div>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[280px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-3">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tip: Use this section for project goals, sprint plans, or quick reminders about your tasks..."
            className="min-h-[120px] max-h-[160px] bg-input border-primary/30 text-foreground placeholder:text-muted-foreground/50 resize-none text-sm focus:border-primary"
          />
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{charCount} characters</span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!notes}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                title="Copy notes"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={!notes}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Clear notes"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
