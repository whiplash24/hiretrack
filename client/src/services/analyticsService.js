const API_URL = "http://localhost:5000/api/analytics"

export const fetchDashboardStats = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (res.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/login"
    return
  }

  return res.json()
}
