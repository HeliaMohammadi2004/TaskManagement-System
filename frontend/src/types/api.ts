export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  owner?: User;
  created_at?: string;
  updated_at?: string;
}

export interface List {
  id: number;
  workspace: number;
  name: string;
  created_at?: string;
}

export interface Task {
  id: number;
  list: number;
  title: string;
  description?: string;
  status: "TODO" | "IN PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  due_date?: string;
  start_date?: string;
  assignee?: number | null;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  order?: number;
  due_date?: string;
  start_date?: string;
}