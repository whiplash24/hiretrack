import api from "../api/axios"

const throwFriendly = (err, fallback) => {
  const msg = err?.response?.data?.message || err?.message || fallback
  throw new Error(msg)
}

export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password })
    return res.data
  } catch (err) {
    throwFriendly(err, "Login failed")
  }
}

export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/register", data)
    return res.data
  } catch (err) {
    throwFriendly(err, "Registration failed")
  }
}
