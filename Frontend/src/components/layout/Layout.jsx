import React from "react"
import { LayoutDashboard, CheckSquare,LogOut } from "lucide-react"
import { cn } from "../../utils/cn"
import { useAuth } from "../../context/AuthContext"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
export const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <CheckSquare className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-textMain tracking-tight">TaskFlow</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.path)
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-textMuted hover:bg-surfaceHover hover:text-textMain"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
                <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-textMain">{user?.name}</p>
              <p className="text-textMuted text-xs">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-textMuted hover:bg-surfaceHover hover:text-textMain transition-all"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
