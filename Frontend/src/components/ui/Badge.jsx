import React from "react"
import { cn } from "../../utils/cn"

export const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-surfaceHover text-textMain border border-border",
    primary: "bg-primary/20 text-blue-400 border border-primary/30",
    success: "bg-success/20 text-emerald-400 border border-success/30",
    warning: "bg-warning/20 text-amber-400 border border-warning/30",
    danger: "bg-danger/20 text-red-400 border border-danger/30",
  }

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm", variants[variant], className)}>
      {children}
    </span>
  )
}

export const StatusBadge = ({ status, className }) => {
  const statusMap = {
    "Pending": "warning",
    "In Progress": "primary",
    "Completed": "success",
    "Blocked": "danger"
  }
  return <Badge variant={statusMap[status] || "default"} className={className}>{status}</Badge>
}

export const PriorityBadge = ({ priority, className }) => {
  const priorityMap = {
    "Low": "default",
    "Medium": "primary",
    "High": "warning",
    "Urgent": "danger"
  }
  return <Badge variant={priorityMap[priority] || "default"} className={className}>{priority}</Badge>
}
