import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { taskService } from "../services/taskService"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { StatusBadge, PriorityBadge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"
import { TaskForm } from "../components/ui/TaskForm"
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from "lucide-react"

export default function TaskDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTask = async () => {
    try {
      const data = await taskService.getTaskById(id)
      setTask(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTask()
  }, [id])

  const handleUpdateTask = async (taskData) => {
    setIsSubmitting(true)
    try {
      await taskService.updateTask(id, taskData)
      setIsEditModalOpen(false)
      fetchTask() // refresh data
    } catch (err) {
      alert("Error updating task: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task? This cannot be undone.")) {
      try {
        await taskService.deleteTask(id)
        navigate('/tasks')
      } catch (err) {
        alert("Error deleting task: " + err.message)
      }
    }
  }

  if (loading) return <div className="p-8 text-textMuted text-center">Loading task details...</div>
  if (error) return <div className="p-8 text-danger bg-danger/10 rounded-lg">{error}</div>
  if (!task) return <div className="p-8 text-textMuted text-center">Task not found</div>

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/tasks')} className="pl-0">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tasks
        </Button>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Task
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-border/50 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <div className="flex items-center space-x-4 mt-4 text-sm text-textMuted">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created: {new Date(task.created_at).toLocaleDateString()}
                </div>
                {task.due_date && (
                  <div className="flex items-center text-amber-500/80">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge status={task.status} className="text-sm px-3 py-1" />
              <PriorityBadge priority={task.priority} className="text-sm px-3 py-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <h4 className="text-sm font-medium text-textMuted mb-2">Description</h4>
          <div className="bg-surfaceHover/30 rounded-lg p-4 min-h-[150px] whitespace-pre-wrap">
            {task.description || <span className="italic text-textMuted/50">No description provided.</span>}
          </div>
          
          {/* Future location for Comments/Notes section */}
          <div className="mt-8 border-t border-border/50 pt-8">
             <h4 className="text-sm font-medium text-textMuted mb-4">Activity & Comments</h4>
             <p className="text-sm text-textMuted/70 italic">Comments implementation is slated for future updates.</p>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Task"
      >
        <TaskForm 
          initialData={task}
          onSubmit={handleUpdateTask} 
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}
