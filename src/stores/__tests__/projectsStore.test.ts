import { renderHook } from "@testing-library/react-native";
import { useProjectsStore } from "../projectsStore";

jest.mock("../../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: [], error: null }),
    single: jest.fn().mockResolvedValue({
      data: {
        id: "p1",
        user_id: "u1",
        goal_id: "g1",
        name: "Test Project",
        description: "",
        income_type: "income",
        status: "active",
        created_at: new Date().toISOString(),
      },
      error: null,
    }),
  },
}));

describe("useProjectsStore", () => {
  it("starts with empty projects", () => {
    const { result } = renderHook(() => useProjectsStore());
    expect(result.current.projects).toEqual([]);
  });

  it("has fetchProjects function", () => {
    const { result } = renderHook(() => useProjectsStore());
    expect(typeof result.current.fetchProjects).toBe("function");
  });

  it("has createProject function", () => {
    const { result } = renderHook(() => useProjectsStore());
    expect(typeof result.current.createProject).toBe("function");
  });

  it("projectsByGoal returns projects for a specific goal", () => {
    const { result } = renderHook(() => useProjectsStore());
    expect(Array.isArray(result.current.projectsByGoal("g1"))).toBe(true);
  });

  it("activeProjects returns only active projects", () => {
    const { result } = renderHook(() => useProjectsStore());
    expect(Array.isArray(result.current.activeProjects())).toBe(true);
  });
});
