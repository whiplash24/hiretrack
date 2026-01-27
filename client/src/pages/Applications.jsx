import { useEffect, useState } from "react";
import { fetchApplications } from "../services/applicationService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      const data = await fetchApplications();
      setApplications(data);
      setLoading(false);
    };
    loadApps();
  }, []);

  if (loading) {
    return <div className="p-6">Loading applications...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white p-4 rounded shadow border"
          >
            <h2 className="font-semibold">{app.company}</h2>
            <p>{app.role}</p>
            <p className="text-sm text-gray-500">{app.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applications;
