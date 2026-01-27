import api from "../api/axios"

export const fetchApplications = async () => {
  const res = await api.get("/applications")
  return res.data
}

export const createApplication = async (data) => {
  const res = await api.post("/applications", data)
  return res.data
}
