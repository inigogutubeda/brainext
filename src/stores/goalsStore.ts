import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Goal } from "../types";

interface CreateGoalInput {
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  horizon: Goal["horizon"];
  dimension: Goal["dimension"];
}

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  fetchGoals: (userId: string) => Promise<void>;
  createGoal: (userId: string, input: CreateGoalInput) => Promise<string | null>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<string | null>;
  activeGoals: () => Goal[];
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("priority", { ascending: true });
    if (!error && data) set({ goals: data });
    set({ loading: false });
  },

  createGoal: async (userId, input) => {
    const { data, error } = await supabase
      .from("goals")
      .insert({ ...input, user_id: userId, status: "active" })
      .select()
      .single();
    if (!error && data) {
      set((state) => ({ goals: [...state.goals, data] }));
    }
    return error?.message ?? null;
  },

  updateGoal: async (id, updates) => {
    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? data : g)),
      }));
    }
    return error?.message ?? null;
  },

  activeGoals: () => get().goals.filter((g) => g.status === "active"),
}));
