import type { Task, TaskCreate, TaskUpdate } from "../types/tasks";

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        if (body?.detail) {
          detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
        }
      } catch {
        /* ignore */
      }
      throw new Error(detail);
    }
  
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  export const tasksApi = {
    list: () => request<Task[]>("/tasks"),
    create: (data: TaskCreate) =>
      request<Task>("/tasks", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: TaskUpdate) =>
      request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: number) =>
      request<void>(`/tasks/${id}`, { method: "DELETE" }),
  };