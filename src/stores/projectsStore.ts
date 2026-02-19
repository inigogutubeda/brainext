import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Project } from "../types";

interface CreateProjectInput {
  goal_id: string;
  name: string;
  description: string;
  income_type: Project["income_type"];
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  fetchProjects: (userId: string) => Promise<void>;
  createProject: (userId: string, input: CreateProjectInput) => Promise<string | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<string | null>;
  projectsByGoal: (goalId: string) => Project[];
  activeProjects: () => Project[];
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) set({ projects: data });
    set({ loading: false });
  },

  createProject: async (userId, input) => {
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...input, user_id: userId, status: "active" })
      .select()
      .single();
    if (!error && data) {
      set((state) => ({ projects: [...state.projects, data] }));
    }
    return error?.message ?? null;
  },

  updateProject: async (id, updates) => {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? data : p)),
      }));
    }
    return error?.message ?? null;
  },

  projectsByGoal: (goalId) => get().projects.filter((p) => p.goal_id === goalId),
  activeProjects: () => get().projects.filter((p) => p.status === "active"),
}));
