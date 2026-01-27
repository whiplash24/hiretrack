import api from "../api/axios";

export const fetchApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post("/applications", data);
  return response.data;
};
