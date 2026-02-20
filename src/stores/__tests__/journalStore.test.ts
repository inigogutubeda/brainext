import { renderHook } from "@testing-library/react-native";
import { useJournalStore } from "../journalStore";

jest.mock("../../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: {
        id: "j1",
        user_id: "u1",
        date: "2026-02-19",
        free_text: "Hoy fue un buen día",
        guided_answers: { q1: "", q2: "", q3: "", alignment_score: 4 },
        related_project_ids: [],
        created_at: new Date().toISOString(),
      },
      error: null,
    }),
  },
}));

describe("useJournalStore", () => {
  it("starts with no today entry", () => {
    const { result } = renderHook(() => useJournalStore());
    expect(result.current.todayEntry).toBeNull();
  });

  it("has saveEntry function", () => {
    const { result } = renderHook(() => useJournalStore());
    expect(typeof result.current.saveEntry).toBe("function");
  });

  it("has fetchTodayEntry function", () => {
    const { result } = renderHook(() => useJournalStore());
    expect(typeof result.current.fetchTodayEntry).toBe("function");
  });
});
