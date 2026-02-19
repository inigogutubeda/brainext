import { renderHook } from "@testing-library/react-native";
import { useFocusStore } from "../focusStore";

jest.mock("../../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: {
        id: "f1",
        user_id: "u1",
        date: "2026-02-19",
        main_focus: "Terminar propuesta",
        secondary_focus: "Revisar emails",
        intention_notes: "Hoy me centro en cerrar el cliente",
        created_at: new Date().toISOString(),
      },
      error: null,
    }),
  },
}));

describe("useFocusStore", () => {
  it("starts with no today focus", () => {
    const { result } = renderHook(() => useFocusStore());
    expect(result.current.todayFocus).toBeNull();
  });

  it("has saveFocus function", () => {
    const { result } = renderHook(() => useFocusStore());
    expect(typeof result.current.saveFocus).toBe("function");
  });

  it("has fetchTodayFocus function", () => {
    const { result } = renderHook(() => useFocusStore());
    expect(typeof result.current.fetchTodayFocus).toBe("function");
  });
});
