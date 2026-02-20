import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "../types";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  profileLoading: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Pick<Profile, "name" | "profile_type">>) => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  profileLoading: false,
  loading: false,

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) set({ user: data.user ?? null, session: data.session ?? null });
      return error?.message ?? null;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (!error) set({ user: data.user ?? null, session: data.session ?? null });
      return error?.message ?? null;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  fetchProfile: async (userId) => {
    set({ profileLoading: true });
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) set({ profile: data as Profile });
    } finally {
      set({ profileLoading: false });
    }
  },

  updateProfile: async (userId, updates) => {
    set({ profileLoading: true });
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
      if (!error && data) set({ profile: data as Profile });
      return error?.message ?? null;
    } finally {
      set({ profileLoading: false });
    }
  },

  initialize: () => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
    return () => data.subscription.unsubscribe();
  },
}));
