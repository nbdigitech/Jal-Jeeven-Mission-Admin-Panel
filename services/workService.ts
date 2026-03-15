const API_URL = "/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getWorkItems = async (page = 1, limit = 20) => {
  const response = await fetch(
    `${API_URL}/work-items?page=${page}&limit=${limit}`,
    {
      headers: getAuthHeaders(),
    },
  );
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch work items");
  }
  return response.json();
};

export const getWorkItemComponents = async (workItemId: string) => {
  const response = await fetch(
    `${API_URL}/components/work-item/${workItemId}`,
    {
      headers: getAuthHeaders(),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch work item components");
  }
  return response.json();
};

export const getComponentDetails = async (id: string) => {
  const response = await fetch(`${API_URL}/components/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch component details");
  }
  return response.json();
};

export const updateWorkItemComponent = async (id: string, payload: any) => {
  const response = await fetch(`${API_URL}/components/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update component");
  }
  return response.json();
};
