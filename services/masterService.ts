const API_URL = "/api";
const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ================= STATE APIs ================= */
export const getStates = async () => {
  const response = await fetch(`${API_URL}/state`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch state");
  return response.json();
};

export const createState = async (data: {
  stateName: string;
  stateCode?: string;
}) => {
  const response = await fetch(`${API_URL}/state`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create state");
  return response.json();
};

export const updateState = async (
  id: string,
  data: { stateName?: string; stateCode?: string },
) => {
  const response = await fetch(`${API_URL}/state/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update state");
  return response.json();
};

export const deleteState = async (id: string) => {
  const response = await fetch(`${API_URL}/state/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete state");
};

/* ================= BLOCK APIs ================= */
/* ================= BLOCK APIs ================= */
export const getBlocks = async (districtId?: string) => {
  const url = districtId
    ? `${API_URL}/block?districtId=${districtId}`
    : `${API_URL}/block`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch blocks");
  return response.json();
};

export const createBlock = async (data: {
  blockName: string;
  districtId: string;
}) => {
  const response = await fetch(`${API_URL}/block`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create block");
  return response.json();
};

export const updateBlock = async (
  id: string,
  data: { blockName?: string; districtId?: string },
) => {
  const response = await fetch(`${API_URL}/block/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update block");
  return response.json();
};

export const deleteBlock = async (id: string) => {
  const response = await fetch(`${API_URL}/block/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete block");
};

/* ================= DISTRICT APIs ================= */
export const getDistricts = async () => {
  const response = await fetch(`${API_URL}/districts`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch districts");
  return response.json();
};

export const createDistrict = async (data: any) => {
  const response = await fetch(`${API_URL}/districts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create district");
  return response.json();
};

export const updateDistrict = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/districts/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update district");
  return response.json();
};

export const deleteDistrict = async (id: string) => {
  const response = await fetch(`${API_URL}/districts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete district");
};

/* ================= CITY/VILLAGE APIs ================= */
export const getCityVillages = async () => {
  const response = await fetch(`${API_URL}/city-villages`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch city/villages");
  return response.json();
};

export const createCityVillage = async (data: any) => {
  const response = await fetch(`${API_URL}/city-villages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create city/village");
  return response.json();
};

export const updateCityVillage = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/city-villages/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update city/village");
  return response.json();
};

export const deleteCityVillage = async (id: string) => {
  const response = await fetch(`${API_URL}/city-villages/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete city/village");
};

/* ================= PANCHAYAT APIs ================= */
export const getPanchayats = async () => {
  const response = await fetch(`${API_URL}/panchayats`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch panchayats");
  return response.json();
};

export const createPanchayat = async (data: any) => {
  const response = await fetch(`${API_URL}/panchayats`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create panchayat");
  return response.json();
};

export const updatePanchayat = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/panchayats/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update panchayat");
  return response.json();
};

export const deletePanchayat = async (id: string) => {
  const response = await fetch(`${API_URL}/panchayats/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete panchayat");
};

/* ================= DEPARTMENT APIs ================= */
export const getDepartments = async () => {
  const response = await fetch(`${API_URL}/departments`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch departments");
  return response.json();
};

export const createDepartment = async (data: any) => {
  const response = await fetch(`${API_URL}/departments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create department");
  return response.json();
};

export const updateDepartment = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update department");
  return response.json();
};

export const deleteDepartment = async (id: string) => {
  const response = await fetch(`${API_URL}/departments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete department");
};

/* ================= SCHEME APIs ================= */
export const getSchemes = async () => {
  const response = await fetch(`${API_URL}/schemes`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch schemes");
  return response.json();
};

export const createScheme = async (data: any) => {
  const response = await fetch(`${API_URL}/schemes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create scheme");
  return response.json();
};

export const updateScheme = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/schemes/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update scheme");
  return response.json();
};

export const deleteScheme = async (id: string) => {
  const response = await fetch(`${API_URL}/schemes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete scheme");
};

/* ================= WORK APIs (Type & Subtype) ================= */
export const getWorkTypes = async () => {
  const response = await fetch(`${API_URL}/work-types`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch work types");
  return response.json();
};

export const createWorkType = async (data: any) => {
  const response = await fetch(`${API_URL}/work-types`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create work type");
  return response.json();
};

export const updateWorkType = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/work-types/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update work type");
  return response.json();
};

export const deleteWorkType = async (id: string) => {
  const response = await fetch(`${API_URL}/work-types/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete work type");
};

// Subtypes
export const getWorkSubtypes = async (workTypeId?: string) => {
  const url = workTypeId
    ? `${API_URL}/work-subtypes?workTypeId=${workTypeId}`
    : `${API_URL}/work-subtypes`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch work subtypes");
  return response.json();
};

export const createWorkSubtype = async (data: any) => {
  const response = await fetch(`${API_URL}/work-subtypes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create work subtype");
  return response.json();
};

export const updateWorkSubtype = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/work-subtypes/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update work subtype");
  return response.json();
};

export const deleteWorkSubtype = async (id: string) => {
  const response = await fetch(`${API_URL}/work-subtypes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete work subtype");
};

/* ================= PROJECT STATUS APIs ================= */
export const getProjectStatuses = async () => {
  const response = await fetch(`${API_URL}/project-statuses`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch project statuses");
  return response.json();
};

export const createProjectStatus = async (data: any) => {
  const response = await fetch(`${API_URL}/project-statuses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create project status");
  return response.json();
};

export const updateProjectStatus = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/project-statuses/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project status");
  return response.json();
};

export const deleteProjectStatus = async (id: string) => {
  const response = await fetch(`${API_URL}/project-statuses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete project status");
};

/* ================= WORK STAGE TEMPLATE APIs ================= */
export const getWorkStageTemplates = async () => {
  const response = await fetch(`${API_URL}/work-stage-templates`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch work stage templates");
  return response.json();
};

/* ================= USER MANAGEMENT APIs ================= */
export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/auth/users`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const createUser = async (data: any) => {
  const response = await fetch(`${API_URL}/auth/admin/create-user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
};

export const updateUser = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/auth/users/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update user");
  return response.json();
};

export const deleteUser = async (id: string) => {
  const response = await fetch(`${API_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete user");
};

/* ================= CONTRACTOR APIs ================= */
export const getContractors = async () => {
  const response = await fetch(`${API_URL}/contractors`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch contractors");
  return response.json();
};

/* ================= PROJECT APIs ================= */
export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
};

export const updateProject = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
};

export const createProject = async (data: any) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
};

export const deleteProject = async (id: string) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete project");
};

/* ================= PROJECT STAGE TRACKER APIs ================= */
export const getProjectStages = async (projectId: string) => {
  const response = await fetch(
    `${API_URL}/project-stage-trackers/project/${projectId}`,
    {
      headers: getAuthHeaders(),
    },
  );
  if (!response.ok) throw new Error("Failed to fetch project stages");
  return response.json();
};

export const updateProjectStage = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/project-stage-trackers/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project stage");
  return response.json();
};

export const createProjectStage = async (data: any) => {
  const response = await fetch(`${API_URL}/project-stage-trackers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create project stage");
  return response.json();
};
/* ================= DASHBOARD APIs ================= */
export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch dashboard stats");
  return response.json();
};
