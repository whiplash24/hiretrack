import { useEffect, useState } from "react"
import { fetchApplications } from "../services/applicationService"

function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchApplications()
        setApplications(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <div
              key={app._id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{app.company}</h2>
                <p className="text-sm text-gray-500">{app.role}</p>
              </div>
              <span className="text-sm font-medium">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Applications
