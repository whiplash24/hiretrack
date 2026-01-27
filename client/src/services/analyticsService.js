import api from "../api/axios"

export const fetchDashboardStats = async () => {
  const res = await api.get("/analytics")
  return res.data
}
