const API_URL = "http://localhost:5000/api/applications"

export const fetchApplications = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch applications")
  }

  return res.json()
}
