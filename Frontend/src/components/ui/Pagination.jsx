import React from "react"
import { cn } from "../../utils/cn"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./Button"

export const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="text-sm text-textMuted">
        Page <span className="font-medium text-textMain">{currentPage}</span> of <span className="font-medium text-textMain">{totalPages}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
