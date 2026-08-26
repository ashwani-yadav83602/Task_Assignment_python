import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/layout/Layout"

// Lazy load pages later, for now we will create basic components
import DashboardPage from "./pages/DashboardPage"
import TasksPage from "./pages/TasksPage"
import TaskDetailsPage from "./pages/TaskDetailsPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:id" element={<TaskDetailsPage />} />
      </Route>
    </Routes>
  )
}

export default App
