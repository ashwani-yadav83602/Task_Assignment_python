import React from "react"
import { cn } from "../../utils/cn"

export const Table = ({ className, children, ...props }) => (
  <div className="w-full overflow-auto rounded-lg border border-border">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
      {children}
    </table>
  </div>
)

export const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn("bg-surface/50 border-b border-border", className)} {...props}>
    {children}
  </thead>
)

export const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn("divide-y divide-border", className)} {...props}>
    {children}
  </tbody>
)

export const TableRow = ({ className, children, ...props }) => (
  <tr className={cn("transition-colors hover:bg-surfaceHover/50 data-[state=selected]:bg-surfaceHover", className)} {...props}>
    {children}
  </tr>
)

export const TableHead = ({ className, children, ...props }) => (
  <th className={cn("h-12 px-4 text-left align-middle font-medium text-textMuted", className)} {...props}>
    {children}
  </th>
)

export const TableCell = ({ className, children, ...props }) => (
  <td className={cn("p-4 align-middle text-textMain", className)} {...props}>
    {children}
  </td>
)
