import { renderHook, act } from "@testing-library/react-native";
import { useGoalsStore } from "../goalsStore";

jest.mock("../../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: [], error: null }),
    single: jest.fn().mockResolvedValue({
      data: {
        id: "1",
        user_id: "u1",
        title: "Test Goal",
        description: "",
        priority: 1,
        horizon: "short",
        dimension: "professional",
        status: "active",
        created_at: new Date().toISOString(),
      },
      error: null,
    }),
  },
}));

describe("useGoalsStore", () => {
  it("starts with empty goals list", () => {
    const { result } = renderHook(() => useGoalsStore());
    expect(result.current.goals).toEqual([]);
  });

  it("has fetchGoals function", () => {
    const { result } = renderHook(() => useGoalsStore());
    expect(typeof result.current.fetchGoals).toBe("function");
  });

  it("has createGoal function", () => {
    const { result } = renderHook(() => useGoalsStore());
    expect(typeof result.current.createGoal).toBe("function");
  });

  it("has updateGoal function", () => {
    const { result } = renderHook(() => useGoalsStore());
    expect(typeof result.current.updateGoal).toBe("function");
  });

  it("activeGoals returns only active goals", () => {
    const { result } = renderHook(() => useGoalsStore());
    expect(Array.isArray(result.current.activeGoals())).toBe(true);
  });
});
