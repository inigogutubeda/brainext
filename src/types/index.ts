export type ProfileType = "freelancer" | "entrepreneur" | "creative" | "business_owner";

// Profile matches the public.profiles table (NOT the Supabase auth User)
export interface Profile {
  id: string;
  email: string;
  name: string;
  profile_type: ProfileType | null; // null = user hasn't completed onboarding yet
  created_at: string;
}

// Kept for backward compat — use Profile instead of User going forward
export interface User {
  id: string;
  email: string;
  name: string;
  profile_type: ProfileType;
  created_at: string;
}

export type GoalHorizon = "short" | "mid" | "long";
export type GoalDimension = "personal" | "professional" | "financial";
export type GoalStatus = "active" | "paused" | "completed";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  horizon: GoalHorizon;
  dimension: GoalDimension;
  status: GoalStatus;
  created_at: string;
}

export type IncomeType = "income" | "non_income";
export type ProjectStatus = "active" | "paused" | "closed";

export interface Project {
  id: string;
  user_id: string;
  goal_id: string;
  name: string;
  description: string;
  income_type: IncomeType;
  status: ProjectStatus;
  created_at: string;
}

export type EffortLevel = "low" | "medium" | "high";
export type ImpactLevel = "low" | "medium" | "high";
export type ActionStatus = "pending" | "done" | "skipped";

export interface Action {
  id: string;
  user_id: string;
  project_id: string;
  description: string;
  effort_level: EffortLevel;
  perceived_impact: ImpactLevel;
  status: ActionStatus;
  scheduled_for: string;
  created_at: string;
}

export interface DailyFocus {
  id: string;
  user_id: string;
  date: string;
  main_focus: string;
  secondary_focus: string;
  intention_notes: string;
  created_at: string;
}

// Generalized: q1/q2/q3 mapped from profile-specific questions in PROFILE_CONFIG
export interface GuidedAnswers {
  q1: string;
  q2: string;
  q3: string;
  alignment_score: 1 | 2 | 3 | 4 | 5;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  free_text: string;
  guided_answers: GuidedAnswers;
  related_project_ids: string[];
  created_at: string;
}
