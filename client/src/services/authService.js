const API_URL = "http://localhost:5000/api/auth"

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Login failed")
  }

  return res.json()
}
