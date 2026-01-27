import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchDashboardStats } from "../services/analyticsService"

function Dashboard() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchDashboardStats()
      setStats(data)
    }

    loadStats()
  }, [])

const handleLogout = () => {
  if (window.confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("token")
    navigate("/login")
  }
}

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Applications" value={stats.total} />
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Offers" value={stats.offers} />
        <StatCard title="Rejected" value={stats.rejected} />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/applications")}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          View Applications
        </button>

        <button
          onClick={() => navigate("/add-application")}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Add Application
        </button>
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default Dashboard
