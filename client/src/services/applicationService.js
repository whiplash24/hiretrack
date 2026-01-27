import api from "../api/axios"

export const fetchApplications = async () => {
  const res = await api.get("/applications")
  return res.data
}

export const createApplication = async (data) => {
  const res = await api.post("/applications", data)
  return res.data
}

export const updateApplicationStatus = async (id, status) => {
  const res = await api.put(`/applications/${id}/status`, { status })
  return res.data
}

export const deleteApplication = async (id) => {
  const res = await api.delete(`/applications/${id}`)
  return res.data
}
