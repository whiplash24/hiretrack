import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createApplication } from "../services/applicationService"

function AddApplication() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    domain: "",
    type: "INTERNSHIP",
    stipendOrSalary: "",
    notes: ""
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createApplication(form)
    navigate("/applications")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Add Application</h1>

        <input name="company" placeholder="Company" className="w-full mb-3 p-2 border rounded" onChange={handleChange} required />
        <input name="role" placeholder="Role" className="w-full mb-3 p-2 border rounded" onChange={handleChange} required />
        <input name="domain" placeholder="Domain (SDE, ML, etc.)" className="w-full mb-3 p-2 border rounded" onChange={handleChange} />

        <select name="type" className="w-full mb-3 p-2 border rounded" onChange={handleChange}>
          <option value="INTERNSHIP">Internship</option>
          <option value="FULL_TIME">Full Time</option>
        </select>

        <input name="stipendOrSalary" placeholder="Stipend / Salary" className="w-full mb-3 p-2 border rounded" onChange={handleChange} />
        <textarea name="notes" placeholder="Notes" className="w-full mb-4 p-2 border rounded" onChange={handleChange} />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Application
        </button>
      </form>
    </div>
  )
}

export default AddApplication
