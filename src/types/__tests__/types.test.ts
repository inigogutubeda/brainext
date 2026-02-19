import { User, Goal, Project, Action, DailyFocus, JournalEntry } from "../index";

describe("Types", () => {
  it("Goal has required fields", () => {
    const goal: Goal = {
      id: "uuid",
      user_id: "uuid",
      title: "Get first client",
      description: "Land a paying client in 3 months",
      priority: 1,
      horizon: "short",
      dimension: "financial",
      status: "active",
      created_at: new Date().toISOString(),
    };
    expect(goal.id).toBe("uuid");
  });

  it("Project requires a goal_id", () => {
    const project: Project = {
      id: "uuid",
      user_id: "uuid",
      goal_id: "uuid",
      name: "Portfolio website",
      description: "Build portfolio to attract clients",
      income_type: "income",
      status: "active",
      created_at: new Date().toISOString(),
    };
    expect(project.goal_id).toBe("uuid");
  });
});
