import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Applications from "./pages/Applications"
import AddApplication from "./pages/AddApplication"
import JobDetail from "./pages/JobDetail"
import Settings from "./pages/Settings"
import Landing from "./pages/Landing"
import NotFound from "./pages/NotFound"

import ProtectedRoute from "./components/ProtectedRoute"
import AppShell from "./layouts/AppShell"

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authed — share the AppShell chrome */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/:id" element={<JobDetail />} />
        <Route path="/add-application" element={<AddApplication />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
