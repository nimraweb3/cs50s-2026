import {
  Application,
  ApplicationDetail,
  ApplicationWithGap,
  DashboardResponse,
  Followup,
  Skill,
  Status,
} from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const getApplications = () => request<ApplicationWithGap[]>("/api/applications");

export const getApplication = (id: number) =>
  request<ApplicationDetail>(`/api/applications/${id}`);

export const addApplication = (data: { company: string; role: string; jdText: string }) =>
  request<{ id: number; requiredSkills: string[]; matchedSkills: string[]; missingSkills: string[] }>(
    "/api/applications",
    { method: "POST", body: JSON.stringify(data) }
  );

export const updateStatus = (id: number, status: Status) =>
  request<{ id: number; status: Status }>(`/api/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const getSkills = () => request<Skill[]>("/api/skills");

export const getUserSkills = () => request<Skill[]>("/api/user-skills");

export const addUserSkill = (skillId: number) =>
  request<{ skillId: number }>("/api/user-skills", {
    method: "POST",
    body: JSON.stringify({ skillId }),
  });

export const removeUserSkill = (skillId: number) =>
  request<void>(`/api/user-skills/${skillId}`, { method: "DELETE" });

export const getDashboard = () => request<DashboardResponse>("/api/dashboard");

export const getFollowups = () => request<Followup[]>("/api/followups");
