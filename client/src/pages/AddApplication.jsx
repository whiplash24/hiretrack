import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createApplication } from "../services/applicationService"

function AddApplication() {
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createApplication({ company, role })
      navigate("/applications")
    } catch (err) {
      console.error("Create application failed", err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Application</h1>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <input
          className="border p-2 w-full"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  )
}

export default AddApplication
