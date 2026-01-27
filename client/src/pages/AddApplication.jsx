import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../services/applicationService";

function AddApplication() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "APPLIED",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createApplication(form);
    navigate("/applications");
  } catch (err) {
    console.error("Create application failed:", err);
    alert("Failed to save application. Check console.");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h1 className="text-xl font-bold mb-4">Add Application</h1>

        <input
          name="company"
          placeholder="Company"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          name="role"
          placeholder="Role"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <select
          name="status"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
        >
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}

export default AddApplication;
