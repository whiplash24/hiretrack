import { useEffect, useState } from "react"
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../services/applicationService"

function Applications() {
  const [apps, setApps] = useState([])

  const loadApps = async () => {
    const data = await fetchApplications()
    setApps(data)
  }

  useEffect(() => {
    loadApps()
  }, [])

  const handleStatusChange = async (id, status) => {
    await updateApplicationStatus(id, status)
    loadApps()
  }

  const handleDelete = async (id) => {
    await deleteApplication(id)
    setApps(apps.filter((a) => a._id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      {apps.length === 0 && <p>No applications yet.</p>}

      <div className="space-y-3">
        {apps.map((app) => (
          <div key={app._id} className="border p-4 rounded flex justify-between">
            <div>
              <p className="font-semibold">{app.company}</p>
              <p className="text-sm">{app.role}</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={app.status}
                onChange={(e) =>
                  handleStatusChange(app._id, e.target.value)
                }
                className="border p-1"
              >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <button
                onClick={() => handleDelete(app._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Applications
