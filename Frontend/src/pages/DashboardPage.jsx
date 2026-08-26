import React, { useEffect, useState } from "react"
import { dashboardService } from "../services/dashboardService"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { CheckCircle2, Clock, ListTodo, AlertCircle, LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-danger/20 text-red-400 rounded-lg border border-danger/30">
        Error loading dashboard: {error}
      </div>
    )
  }

  const statCards = [
    { title: "Total Tasks", value: stats.total_tasks, icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Pending", value: stats.pending_tasks, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "In Progress", value: stats.in_progress_tasks, icon: ListTodo, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Completed", value: stats.completed_tasks, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Overdue", value: stats.overdue_tasks, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-textMain tracking-tight">Dashboard Overview</h1>
        <p className="text-textMuted mt-1">Here is a quick look at the team's current progress.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="overflow-hidden border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-textMuted">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-textMain mt-1">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
