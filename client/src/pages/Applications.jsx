import { useEffect, useState } from "react"
import { fetchApplications } from "../services/applicationService"

function Applications() {
  const [apps, setApps] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchApplications()
      setApps(data)
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      {apps.length === 0 && <p>No applications yet.</p>}

      <ul className="space-y-2">
        {apps.map((app) => (
          <li key={app._id} className="border p-3 rounded">
            <p className="font-semibold">{app.company}</p>
            <p className="text-sm text-gray-600">{app.role}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Applications
