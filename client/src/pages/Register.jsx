import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../services/authService"

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    graduationYear: ""
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const data = await registerUser(form)
      localStorage.setItem("token", data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input name="name" placeholder="Name" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <input name="college" placeholder="College" className="w-full mb-2 p-2 border rounded" onChange={handleChange} />
        <input name="branch" placeholder="Branch" className="w-full mb-2 p-2 border rounded" onChange={handleChange} />
        <input name="graduationYear" placeholder="Graduation Year" className="w-full mb-4 p-2 border rounded" onChange={handleChange} />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
