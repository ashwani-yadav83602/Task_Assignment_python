import React from "react"
import { cn } from "../../utils/cn"

export const Button = React.forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98]"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryHover shadow-lg shadow-primary/25",
    secondary: "bg-surfaceHover text-textMain hover:bg-slate-600",
    danger: "bg-danger text-white hover:bg-red-600 shadow-lg shadow-danger/25",
    ghost: "bg-transparent text-textMuted hover:text-textMain hover:bg-surfaceHover",
  }

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10 p-2",
  }

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"
