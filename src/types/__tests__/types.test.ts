import { User, Goal, Project, DailyFocus, JournalEntry, Profile } from "../index";

describe("Types", () => {
  it("ProfileType includes business_owner", () => {
    const p: Profile = {
      id: "uuid",
      email: "a@b.com",
      name: "Test",
      profile_type: "business_owner",
      created_at: new Date().toISOString(),
    };
    expect(p.profile_type).toBe("business_owner");
  });

  it("Profile.profile_type can be null (pre-onboarding)", () => {
    const p: Profile = {
      id: "uuid",
      email: "a@b.com",
      name: "",
      profile_type: null,
      created_at: new Date().toISOString(),
    };
    expect(p.profile_type).toBeNull();
  });

  it("GuidedAnswers uses q1/q2/q3 fields", () => {
    const g: import("../index").GuidedAnswers = {
      q1: "Construí la landing",
      q2: "Revisar emails",
      q3: "Bastante bien",
      alignment_score: 4,
    };
    expect(g.q1).toBeDefined();
    expect(g.alignment_score).toBe(4);
  });

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
});
