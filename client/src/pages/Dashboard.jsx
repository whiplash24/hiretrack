import { useEffect, useState } from "react"
import { fetchDashboardStats } from "../services/analyticsService"

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchDashboardStats()
      setStats(data)
    }

    loadStats()
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={stats.total} />
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Offers" value={stats.offers} />
        <StatCard title="Rejected" value={stats.rejected} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">
          Conversion Rate: {stats.conversionRate}%
        </h2>
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
