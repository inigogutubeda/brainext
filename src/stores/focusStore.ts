import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { DailyFocus } from "../types";

interface SaveFocusInput {
  main_focus: string;
  secondary_focus: string;
  intention_notes: string;
}

interface FocusState {
  todayFocus: DailyFocus | null;
  loading: boolean;
  fetchTodayFocus: (userId: string, date: string) => Promise<void>;
  saveFocus: (userId: string, date: string, input: SaveFocusInput) => Promise<string | null>;
}

export const useFocusStore = create<FocusState>((set) => ({
  todayFocus: null,
  loading: false,

  fetchTodayFocus: async (userId, date) => {
    set({ loading: true });
    try {
      const { data } = await supabase
        .from("daily_focus")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .single();
      set({ todayFocus: data ?? null });
    } finally {
      set({ loading: false });
    }
  },

  saveFocus: async (userId, date, input) => {
    const { data, error } = await supabase
      .from("daily_focus")
      .upsert({ ...input, user_id: userId, date }, { onConflict: "user_id,date" })
      .select()
      .single();
    if (!error && data) set({ todayFocus: data });
    return error?.message ?? null;
  },
}));
