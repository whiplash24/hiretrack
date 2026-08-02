import { Navigate } from "react-router-dom"

export default function RedirectIfAuthed({ children, to = "/dashboard" }) {
  const token = typeof window !== "undefined" && localStorage.getItem("token")
  if (token) return <Navigate to={to} replace />
  return children
}
