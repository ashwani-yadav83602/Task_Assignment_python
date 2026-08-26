import React, { useState } from "react"
import { Input } from "./Input"
import { Select } from "./Select"
import { Button } from "./Button"

export const TaskForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "Pending",
    priority: initialData?.priority || "Medium",
    due_date: initialData?.due_date ? initialData.due_date.split('T')[0] : "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Convert empty string due_date to null
    const submitData = {
      ...formData,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
    }
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-textMuted mb-1">Title</label>
        <Input 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          placeholder="Task title..." 
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-textMuted mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="flex min-h-[80px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-textMain placeholder:text-textMuted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Task description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Status</label>
          <Select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Priority</label>
          <Select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-textMuted mb-1">Due Date</label>
        <Input 
          type="date" 
          name="due_date" 
          value={formData.due_date} 
          onChange={handleChange} 
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Task"}
        </Button>
      </div>
    </form>
  )
}
