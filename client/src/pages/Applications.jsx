import { useEffect, useState } from "react";
import { fetchApplications, deleteApplication } from "../services/applicationService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleDelete = async (id) => {
    await deleteApplication(id);
    setApplications(applications.filter(app => app._id !== id));
  };

  if (loading) {
    return <p className="p-6">Loading applications...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <div
              key={app._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{app.company}</h2>
                <p className="text-sm text-gray-600">{app.role}</p>
                <p className="text-xs text-gray-500">{app.status}</p>
              </div>

              <button
                onClick={() => handleDelete(app._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;
