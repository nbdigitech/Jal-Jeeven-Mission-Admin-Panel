import { getAuthHeaders } from "./workService";

const API_URL = "/api";

export const getAgreements = async (page = 1, limit = 20) => {
  const response = await fetch(`${API_URL}/agreements?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch agreements");
  }
  return response.json();
};
