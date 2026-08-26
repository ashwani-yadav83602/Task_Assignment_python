import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { taskService } from "../services/taskService"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { StatusBadge, PriorityBadge } from "../components/ui/Badge"
import { Pagination } from "../components/ui/Pagination"
import { Modal } from "../components/ui/Modal"
import { TaskForm } from "../components/ui/TaskForm"
import { Plus, Search } from "lucide-react"

export default function TasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters & Pagination
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const data = await taskService.getTasks({
        search,
        status: statusFilter,
        priority: priorityFilter,
        page,
        limit
      })
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [search, statusFilter, priorityFilter, page])

  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true)
    try {
      await taskService.createTask(taskData)
      setIsModalOpen(false)
      fetchTasks() // Refresh list
    } catch (err) {
      alert("Error creating task: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate generic total pages (ideally backend would return total_count, but we'll simulate for now based on returned items)
  const hasMore = tasks.length === limit

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain tracking-tight">Tasks</h1>
          <p className="text-textMuted mt-1">Manage and track your team's work.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-textMuted" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Select>
        </div>
      </div>

      {/* Task Table */}
      {error && <div className="text-danger bg-danger/10 p-4 rounded-lg">{error}</div>}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-textMuted">Loading tasks...</TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-textMuted">No tasks found.</TableCell>
            </TableRow>
          ) : (
            tasks.map(task => (
              <TableRow 
                key={task.id} 
                className="cursor-pointer"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell><StatusBadge status={task.status} /></TableCell>
                <TableCell><PriorityBadge priority={task.priority} /></TableCell>
                <TableCell>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination 
        currentPage={page} 
        totalPages={hasMore ? page + 1 : page} // Simple hack since we don't have total_count from API yet
        onPageChange={setPage} 
      />

      {/* Create Task Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Task"
      >
        <TaskForm 
          onSubmit={handleCreateTask} 
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
