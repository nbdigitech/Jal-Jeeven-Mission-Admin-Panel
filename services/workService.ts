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

export const getWorkItem = async (id: string) => {
  const response = await fetch(`${API_URL}/work-items/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch work item details");
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

export const getComponentPhotos = async (componentId: string) => {
  const response = await fetch(
    `${API_URL}/photos/component/${componentId}/review`,
    {
      headers: getAuthHeaders(),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch component photos");
  }
  return response.json();
};

export const createWorkItem = async (payload: any) => {
  const response = await fetch(`${API_URL}/work-items`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create work item");
  }
  return response.json();
};

export const getUsers = async (page = 1, limit = 100) => {
  const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
export const submitComponentPhoto = async (componentId: string, photoId: string) => {
  const response = await fetch(`${API_URL}/components/${componentId}/submit-photo`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ photoId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit photo");
  }
  return response.json();
};
