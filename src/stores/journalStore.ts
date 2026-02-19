import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { JournalEntry, GuidedAnswers } from "../types";

interface SaveEntryInput {
  free_text: string;
  guided_answers: GuidedAnswers;
  related_project_ids: string[];
}

interface JournalState {
  todayEntry: JournalEntry | null;
  loading: boolean;
  fetchTodayEntry: (userId: string, date: string) => Promise<void>;
  saveEntry: (userId: string, date: string, input: SaveEntryInput) => Promise<string | null>;
}

export const useJournalStore = create<JournalState>((set) => ({
  todayEntry: null,
  loading: false,

  fetchTodayEntry: async (userId, date) => {
    set({ loading: true });
    try {
      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .single();
      set({ todayEntry: data ?? null });
    } finally {
      set({ loading: false });
    }
  },

  saveEntry: async (userId, date, input) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .upsert({ ...input, user_id: userId, date }, { onConflict: "user_id,date" })
      .select()
      .single();
    if (!error && data) set({ todayEntry: data });
    return error?.message ?? null;
  },
}));
