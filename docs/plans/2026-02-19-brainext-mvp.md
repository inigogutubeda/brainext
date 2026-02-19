# Brainext MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a cross-platform mobile app that helps freelancers, entrepreneurs, and creatives align daily actions with life goals and financial reality through three structured moments: morning focus, evening journal, and weekly review.

**Architecture:** Expo (React Native) app with Supabase as the backend (PostgreSQL + auth). Navigation is tab-based (Home, Goals, Projects) with stack navigators per tab. State is local-first using Zustand stores that sync with Supabase.

**Tech Stack:** Expo SDK 54, React Native, TypeScript, Supabase (PostgreSQL + GoTrue auth), React Navigation v6, Zustand, NativeWind v4, Jest, @testing-library/react-native

---

## Agent Team Execution Model

This plan is structured into 4 sequential waves. Within Wave 2 and Wave 3, agents run **in parallel**. Each agent has exclusive file ownership — agents must never touch files outside their ownership boundary.

```
Wave 1 — Foundation (1 Agent, sequential)
  └── Foundation Agent: Tasks 1–7
       All files in: package.json, App.tsx, src/lib/, src/types/,
       src/stores/authStore.ts, src/navigation/, src/screens/auth/,
       src/screens/HomeScreen.tsx (placeholder), src/screens/GoalsScreen.tsx (placeholder),
       src/screens/ProjectsScreen.tsx (placeholder), supabase/

Wave 2 — Feature Stores & Screens (2 Agents, parallel — start after Wave 1 commits)
  ├── Goals Agent: Task 8
  │    Owns: src/stores/goalsStore.ts, src/stores/__tests__/goalsStore.test.ts,
  │          src/screens/goals/*, src/screens/GoalsScreen.tsx
  │    MUST NOT touch: HomeScreen.tsx, navigation/index.tsx, projectsStore.ts
  │
  └── Projects Agent: Task 9
       Owns: src/stores/projectsStore.ts, src/stores/__tests__/projectsStore.test.ts,
             src/screens/projects/*, src/screens/ProjectsScreen.tsx
       MUST NOT touch: HomeScreen.tsx, navigation/index.tsx, goalsStore.ts
       NOTE: imports goalsStore (already committed by Wave 1 foundation) — mock it in tests

Wave 3 — Core Moment Stores + Isolated Screens (2 Agents, parallel — start after Wave 2 commits)
  ├── Focus Agent: Task 10 (STORES + SCREEN ONLY — no HomeScreen or nav changes)
  │    Owns: src/stores/focusStore.ts, src/stores/__tests__/focusStore.test.ts,
  │          src/screens/focus/MorningFocusScreen.tsx
  │    MUST NOT touch: HomeScreen.tsx, navigation/index.tsx
  │
  └── Journal Agent: Task 11 (STORES + SCREEN ONLY — no HomeScreen or nav changes)
       Owns: src/stores/journalStore.ts, src/stores/__tests__/journalStore.test.ts,
             src/screens/journal/EveningJournalScreen.tsx
       MUST NOT touch: HomeScreen.tsx, navigation/index.tsx

Wave 4 — Integration (1 Agent, sequential — start after Wave 3 commits)
  └── Integration Agent: Tasks 12–13
       Owns: src/navigation/index.tsx (wire all new screens),
             src/screens/HomeScreen.tsx (add focus/journal/review buttons),
             src/screens/review/WeeklyReviewScreen.tsx,
             sign-out UI
```

**Gate rule:** Each wave must be fully committed and all tests passing before the next wave starts.

---

## Prerequisites (manual, not automated)

1. Install Node.js LTS: https://nodejs.org
2. Install Expo CLI: `npm install -g expo-cli`
3. Install EAS CLI: `npm install -g eas-cli`
4. Create a free Supabase project at https://supabase.com and note:
   - Project URL (looks like `https://xxxx.supabase.co`)
   - Anon public key (under Project Settings → API)
5. Install Expo Go on your physical device or set up an Android/iOS simulator.

---

---

## Wave 1 — Foundation Agent (Tasks 1–7, sequential)

> One agent executes all of these in order. Commit after each task. No other agents run yet.

---

## Task 1: Initialize Expo Project with TypeScript

**Files:**
- Create: `package.json` (auto-generated)
- Create: `app.json` (auto-generated)
- Create: `tsconfig.json` (auto-generated)
- Create: `.env.local`
- Create: `.gitignore` (update)
- Create: `babel.config.js`

**Step 1: Scaffold the project**

Run from the parent directory (Desktop):
```bash
npx create-expo-app@latest brainext --template blank-typescript
cd brainext
```
Expected: Expo project created with TypeScript template.

**Step 2: Verify it boots**

```bash
npx expo start
```
Expected: QR code appears, app loads "Open up App.tsx to start working on your app!" on device.

Press `Ctrl+C` to stop.

**Step 3: Create `.env.local` for Supabase credentials**

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Step 4: Update `.gitignore` to include env file**

Add to the end of `.gitignore`:
```
.env.local
.env
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: initialize Expo TypeScript project"
```
Expected: Clean commit.

---

## Task 2: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install all required packages**

```bash
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

```bash
npm install zustand
```

```bash
npx expo install nativewind tailwindcss
```

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native jest-expo @types/jest
```

**Step 2: Configure NativeWind — create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Step 3: Update `babel.config.js`**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

**Step 4: Create `metro.config.js`**

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./src/global.css" });
```

**Step 5: Create `src/global.css`**

```bash
mkdir -p src
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 6: Create `src/nativewind-env.d.ts`**

```ts
/// <reference types="nativewind/types" />
```

**Step 7: Configure Jest — add to `package.json`**

Add this section inside `package.json`:
```json
"jest": {
  "preset": "jest-expo",
  "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"],
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind)"
  ]
}
```

**Step 8: Verify Jest works**

```bash
npx jest --passWithNoTests
```
Expected: "No tests found, exiting with code 0" or passes.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: install and configure dependencies (navigation, supabase, zustand, nativewind, jest)"
```

---

## Task 3: TypeScript Types for All Entities

**Files:**
- Create: `src/types/index.ts`
- Create: `src/types/__tests__/types.test.ts`

**Step 1: Write a smoke test to ensure types compile**

Create `src/types/__tests__/types.test.ts`:
```ts
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
```

**Step 2: Run test to verify it fails (types not defined yet)**

```bash
npx jest src/types
```
Expected: FAIL — "Cannot find module '../index'"

**Step 3: Create `src/types/index.ts`**

```ts
export type ProfileType = "freelancer" | "entrepreneur" | "creative";

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
  scheduled_for: string; // ISO date string YYYY-MM-DD
  created_at: string;
}

export interface DailyFocus {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  main_focus: string;
  secondary_focus: string;
  intention_notes: string;
  created_at: string;
}

export interface GuidedAnswers {
  what_happened: string;
  what_i_avoided: string;
  why: string;
  alignment_score: 1 | 2 | 3 | 4 | 5;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  free_text: string;
  guided_answers: GuidedAnswers;
  related_project_ids: string[];
  created_at: string;
}
```

**Step 4: Run test to verify it passes**

```bash
npx jest src/types
```
Expected: PASS — 2 tests pass.

**Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript entity types"
```

---

## Task 4: Supabase Client Setup

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/__tests__/supabase.test.ts`

**Step 1: Write a test verifying the client is created correctly**

Create `src/lib/__tests__/supabase.test.ts`:
```ts
import { supabase } from "../supabase";

describe("Supabase client", () => {
  it("is defined", () => {
    expect(supabase).toBeDefined();
  });

  it("has auth property", () => {
    expect(supabase.auth).toBeDefined();
  });
});
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/lib
```
Expected: FAIL — "Cannot find module '../supabase'"

**Step 3: Create `src/lib/supabase.ts`**

```ts
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**Step 4: Run test to confirm it passes**

```bash
npx jest src/lib
```
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: configure Supabase client"
```

---

## Task 5: Supabase Database Schema

> This task runs SQL in the Supabase dashboard. No code files are created.

**Step 1: Open Supabase SQL editor**

Go to your Supabase project → SQL Editor → New query.

**Step 2: Run the schema migration**

Paste and run:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null default '',
  profile_type text check (profile_type in ('freelancer', 'entrepreneur', 'creative')) not null default 'freelancer',
  created_at timestamptz default now()
);

-- Goals
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null default '',
  priority smallint check (priority in (1, 2, 3)) not null default 2,
  horizon text check (horizon in ('short', 'mid', 'long')) not null,
  dimension text check (dimension in ('personal', 'professional', 'financial')) not null,
  status text check (status in ('active', 'paused', 'completed')) not null default 'active',
  created_at timestamptz default now()
);

-- Projects
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete cascade not null,
  name text not null,
  description text not null default '',
  income_type text check (income_type in ('income', 'non_income')) not null,
  status text check (status in ('active', 'paused', 'closed')) not null default 'active',
  created_at timestamptz default now()
);

-- Actions (next actions)
create table public.actions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  description text not null,
  effort_level text check (effort_level in ('low', 'medium', 'high')) not null default 'medium',
  perceived_impact text check (perceived_impact in ('low', 'medium', 'high')) not null default 'medium',
  status text check (status in ('pending', 'done', 'skipped')) not null default 'pending',
  scheduled_for date not null,
  created_at timestamptz default now()
);

-- Daily Focus
create table public.daily_focus (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  main_focus text not null,
  secondary_focus text not null default '',
  intention_notes text not null default '',
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Journal Entries
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  free_text text not null default '',
  guided_answers jsonb not null default '{}'::jsonb,
  related_project_ids uuid[] not null default '{}',
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.projects enable row level security;
alter table public.actions enable row level security;
alter table public.daily_focus enable row level security;
alter table public.journal_entries enable row level security;

-- RLS Policies: users can only access their own data
create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users can manage own goals" on public.goals for all using (auth.uid() = user_id);
create policy "Users can manage own projects" on public.projects for all using (auth.uid() = user_id);
create policy "Users can manage own actions" on public.actions for all using (auth.uid() = user_id);
create policy "Users can manage own focus" on public.daily_focus for all using (auth.uid() = user_id);
create policy "Users can manage own journal" on public.journal_entries for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

Expected: "Success. No rows returned"

**Step 3: Verify in Supabase Table Editor**

Navigate to Table Editor → confirm these tables exist: `profiles`, `goals`, `projects`, `actions`, `daily_focus`, `journal_entries`.

**Step 4: Save the migration as a file for reference**

Create `supabase/migrations/001_initial_schema.sql` with the SQL above.

```bash
mkdir -p supabase/migrations
```

Then create the file with the SQL content above.

**Step 5: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase schema migration"
```

---

## Task 6: Auth Store + Sign Up / Sign In

**Files:**
- Create: `src/stores/authStore.ts`
- Create: `src/stores/__tests__/authStore.test.ts`

**Step 1: Write failing tests**

Create `src/stores/__tests__/authStore.test.ts`:
```ts
import { renderHook, act } from "@testing-library/react-native";
import { useAuthStore } from "../authStore";

// Mock supabase
jest.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

describe("useAuthStore", () => {
  it("starts with no user", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
  });

  it("starts not loading", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.loading).toBe(false);
  });

  it("has signIn function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.signIn).toBe("function");
  });

  it("has signUp function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.signUp).toBe("function");
  });

  it("has signOut function", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(typeof result.current.signOut).toBe("function");
  });
});
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/stores
```
Expected: FAIL — "Cannot find module '../authStore'"

**Step 3: Create `src/stores/authStore.ts`**

```ts
import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return error?.message ?? null;
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return error?.message ?? null;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  initialize: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null });
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });

    return () => data.subscription.unsubscribe();
  },
}));
```

**Step 4: Run test to confirm it passes**

```bash
npx jest src/stores
```
Expected: PASS — 5 tests pass.

**Step 5: Commit**

```bash
git add src/stores/
git commit -m "feat: add auth store with signIn/signUp/signOut"
```

---

## Task 7: App Navigation Shell

**Files:**
- Create: `src/navigation/index.tsx`
- Create: `src/screens/auth/LoginScreen.tsx`
- Create: `src/screens/auth/RegisterScreen.tsx`
- Create: `src/screens/HomeScreen.tsx`
- Create: `src/screens/GoalsScreen.tsx`
- Create: `src/screens/ProjectsScreen.tsx`
- Modify: `App.tsx`

**Step 1: Create auth screens (placeholder)**

Create `src/screens/auth/LoginScreen.tsx`:
```tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuthStore();

  const handleLogin = async () => {
    const error = await signIn(email, password);
    if (error) Alert.alert("Error", error);
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-gray-900">Brainext</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 items-center"
        onPress={() => navigation.navigate("Register")}
      >
        <Text className="text-indigo-600">¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}
```

Create `src/screens/auth/RegisterScreen.tsx`:
```tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, loading } = useAuthStore();

  const handleRegister = async () => {
    const error = await signUp(email, password);
    if (error) {
      Alert.alert("Error", error);
    } else {
      Alert.alert("¡Listo!", "Revisa tu email para confirmar tu cuenta.");
      navigation.navigate("Login");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-gray-900">Crear cuenta</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
        placeholder="Contraseña (mín. 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center"
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Creando..." : "Crear cuenta"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-indigo-600">Ya tengo cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Step 2: Create placeholder main screens**

Create `src/screens/HomeScreen.tsx`:
```tsx
import React from "react";
import { View, Text } from "react-native";

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Hoy</Text>
      <Text className="text-gray-500 mt-2">¿En qué vas a invertir tu energía?</Text>
    </View>
  );
}
```

Create `src/screens/GoalsScreen.tsx`:
```tsx
import React from "react";
import { View, Text } from "react-native";

export function GoalsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Objetivos</Text>
    </View>
  );
}
```

Create `src/screens/ProjectsScreen.tsx`:
```tsx
import React from "react";
import { View, Text } from "react-native";

export function ProjectsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Proyectos</Text>
    </View>
  );
}
```

**Step 3: Create `src/navigation/index.tsx`**

```tsx
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../stores/authStore";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { GoalsScreen } from "../screens/GoalsScreen";
import { ProjectsScreen } from "../screens/ProjectsScreen";

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5",
      }}
    >
      <Tab.Screen name="Hoy" component={HomeScreen} />
      <Tab.Screen name="Objetivos" component={GoalsScreen} />
      <Tab.Screen name="Proyectos" component={ProjectsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

**Step 4: Update `App.tsx`**

Replace the entire content:
```tsx
import "./src/global.css";
import React from "react";
import { AppNavigator } from "./src/navigation";

export default function App() {
  return <AppNavigator />;
}
```

**Step 5: Run the app and verify navigation works**

```bash
npx expo start
```

Expected: Login screen appears on device. Can navigate to Register and back.

**Step 6: Commit**

```bash
git add src/screens/ src/navigation/ App.tsx
git commit -m "feat: add navigation shell with auth screens and main tabs"
```

---

---

## Wave 2 — Feature Agents (Tasks 8–9, parallel)

> Start both agents simultaneously after Wave 1's final commit. They own separate files — no conflicts.

---

## Task 8: Goals Store + CRUD
> **Agent: Goals Agent** | File boundary: `src/stores/goalsStore.ts`, `src/screens/goals/*`, `src/screens/GoalsScreen.tsx` — touch nothing else

**Files:**
- Create: `src/stores/goalsStore.ts`
- Create: `src/stores/__tests__/goalsStore.test.ts`
- Create: `src/screens/goals/GoalListScreen.tsx`
- Create: `src/screens/goals/GoalFormScreen.tsx`
- Modify: `src/screens/GoalsScreen.tsx`

**Step 1: Write failing tests**

Create `src/stores/__tests__/goalsStore.test.ts`:
```ts
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
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/stores/__tests__/goalsStore.test.ts
```
Expected: FAIL.

**Step 3: Create `src/stores/goalsStore.ts`**

```ts
import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Goal } from "../types";

interface CreateGoalInput {
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  horizon: Goal["horizon"];
  dimension: Goal["dimension"];
}

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  fetchGoals: (userId: string) => Promise<void>;
  createGoal: (userId: string, input: CreateGoalInput) => Promise<string | null>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<string | null>;
  activeGoals: () => Goal[];
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("priority", { ascending: true });
    if (!error && data) set({ goals: data });
    set({ loading: false });
  },

  createGoal: async (userId, input) => {
    const { data, error } = await supabase
      .from("goals")
      .insert({ ...input, user_id: userId, status: "active" })
      .select()
      .single();
    if (!error && data) {
      set((state) => ({ goals: [...state.goals, data] }));
    }
    return error?.message ?? null;
  },

  updateGoal: async (id, updates) => {
    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? data : g)),
      }));
    }
    return error?.message ?? null;
  },

  activeGoals: () => get().goals.filter((g) => g.status === "active"),
}));
```

**Step 4: Run test to confirm it passes**

```bash
npx jest src/stores/__tests__/goalsStore.test.ts
```
Expected: PASS.

**Step 5: Create `src/screens/goals/GoalFormScreen.tsx`**

```tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Goal } from "../../types";

type Props = {
  navigation: any;
};

const horizonOptions: Goal["horizon"][] = ["short", "mid", "long"];
const dimensionOptions: Goal["dimension"][] = ["personal", "professional", "financial"];

const horizonLabel = { short: "Corto plazo", mid: "Medio plazo", long: "Largo plazo" };
const dimensionLabel = { personal: "Personal", professional: "Profesional", financial: "Financiero" };

export function GoalFormScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [horizon, setHorizon] = useState<Goal["horizon"]>("short");
  const [dimension, setDimension] = useState<Goal["dimension"]>("professional");
  const { createGoal } = useGoalsStore();
  const { user } = useAuthStore();

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Error", "El título es obligatorio.");
    if (!user) return;
    const error = await createGoal(user.id, { title, description, priority, horizon, dimension });
    if (error) Alert.alert("Error", error);
    else navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-lg font-semibold text-gray-700 mb-1">Título</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿Qué quieres conseguir?"
        value={title}
        onChangeText={setTitle}
      />

      <Text className="text-lg font-semibold text-gray-700 mb-1">Descripción</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="¿Por qué importa esto?"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text className="text-lg font-semibold text-gray-700 mb-2">Horizonte</Text>
      <View className="flex-row mb-4 gap-2">
        {horizonOptions.map((h) => (
          <TouchableOpacity
            key={h}
            className={`flex-1 py-2 rounded-lg items-center border ${horizon === h ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setHorizon(h)}
          >
            <Text className={horizon === h ? "text-white font-semibold" : "text-gray-700"}>
              {horizonLabel[h]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-semibold text-gray-700 mb-2">Dimensión</Text>
      <View className="flex-row mb-4 gap-2">
        {dimensionOptions.map((d) => (
          <TouchableOpacity
            key={d}
            className={`flex-1 py-2 rounded-lg items-center border ${dimension === d ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setDimension(d)}
          >
            <Text className={dimension === d ? "text-white font-semibold" : "text-gray-700"}>
              {dimensionLabel[d]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-semibold text-gray-700 mb-2">Prioridad</Text>
      <View className="flex-row mb-8 gap-2">
        {([1, 2, 3] as const).map((p) => (
          <TouchableOpacity
            key={p}
            className={`flex-1 py-2 rounded-lg items-center border ${priority === p ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setPriority(p)}
          >
            <Text className={priority === p ? "text-white font-semibold" : "text-gray-700"}>
              {p === 1 ? "Alta" : p === 2 ? "Media" : "Baja"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Guardar objetivo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

**Step 6: Create `src/screens/goals/GoalListScreen.tsx`**

```tsx
import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Goal } from "../../types";

const statusBadge = {
  active: { label: "Activo", color: "bg-green-100 text-green-700" },
  paused: { label: "Pausado", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completado", color: "bg-gray-100 text-gray-600" },
};

const dimensionLabel = { personal: "Personal", professional: "Profesional", financial: "Financiero" };

function GoalCard({ goal, onPress }: { goal: Goal; onPress: () => void }) {
  const badge = statusBadge[goal.status];
  return (
    <TouchableOpacity className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100" onPress={onPress}>
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-base font-semibold text-gray-900 flex-1">{goal.title}</Text>
        <View className={`px-2 py-1 rounded-full ml-2 ${badge.color.split(" ")[0]}`}>
          <Text className={`text-xs font-medium ${badge.color.split(" ")[1]}`}>{badge.label}</Text>
        </View>
      </View>
      <Text className="text-sm text-gray-500">{dimensionLabel[goal.dimension]} · P{goal.priority}</Text>
    </TouchableOpacity>
  );
}

type Props = { navigation: any };

export function GoalListScreen({ navigation }: Props) {
  const { goals, fetchGoals, loading } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) fetchGoals(user.id);
  }, [user]);

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Objetivos</Text>
        <TouchableOpacity
          className="bg-indigo-600 rounded-full px-4 py-2"
          onPress={() => navigation.navigate("GoalForm")}
        >
          <Text className="text-white font-semibold">+ Nuevo</Text>
        </TouchableOpacity>
      </View>
      {goals.length === 0 && !loading && (
        <Text className="text-gray-400 text-center mt-16">
          Sin objetivos todavía.{"\n"}Añade tu primer objetivo.
        </Text>
      )}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalCard goal={item} onPress={() => {}} />}
      />
    </View>
  );
}
```

**Step 7: Update `src/screens/GoalsScreen.tsx` to use a stack navigator**

```tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GoalListScreen } from "./goals/GoalListScreen";
import { GoalFormScreen } from "./goals/GoalFormScreen";

const Stack = createNativeStackNavigator();

export function GoalsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GoalList" component={GoalListScreen} options={{ title: "Objetivos" }} />
      <Stack.Screen name="GoalForm" component={GoalFormScreen} options={{ title: "Nuevo Objetivo" }} />
    </Stack.Navigator>
  );
}
```

**Step 8: Run tests**

```bash
npx jest src/stores/__tests__/goalsStore.test.ts
```
Expected: PASS.

**Step 9: Commit**

```bash
git add src/stores/goalsStore.ts src/stores/__tests__/goalsStore.test.ts src/screens/goals/ src/screens/GoalsScreen.tsx
git commit -m "feat: add goals store and Goals screens (list + form)"
```

---

## Task 9: Projects Store + CRUD
> **Agent: Projects Agent** | File boundary: `src/stores/projectsStore.ts`, `src/screens/projects/*`, `src/screens/ProjectsScreen.tsx` — touch nothing else

**Files:**
- Create: `src/stores/projectsStore.ts`
- Create: `src/stores/__tests__/projectsStore.test.ts`
- Create: `src/screens/projects/ProjectListScreen.tsx`
- Create: `src/screens/projects/ProjectFormScreen.tsx`
- Modify: `src/screens/ProjectsScreen.tsx`

**Step 1: Write failing tests**

Create `src/stores/__tests__/projectsStore.test.ts`:
```ts
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
});
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/stores/__tests__/projectsStore.test.ts
```
Expected: FAIL.

**Step 3: Create `src/stores/projectsStore.ts`**

```ts
import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Project } from "../types";

interface CreateProjectInput {
  goal_id: string;
  name: string;
  description: string;
  income_type: Project["income_type"];
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  fetchProjects: (userId: string) => Promise<void>;
  createProject: (userId: string, input: CreateProjectInput) => Promise<string | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<string | null>;
  projectsByGoal: (goalId: string) => Project[];
  activeProjects: () => Project[];
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async (userId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) set({ projects: data });
    set({ loading: false });
  },

  createProject: async (userId, input) => {
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...input, user_id: userId, status: "active" })
      .select()
      .single();
    if (!error && data) {
      set((state) => ({ projects: [...state.projects, data] }));
    }
    return error?.message ?? null;
  },

  updateProject: async (id, updates) => {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? data : p)),
      }));
    }
    return error?.message ?? null;
  },

  projectsByGoal: (goalId) => get().projects.filter((p) => p.goal_id === goalId),
  activeProjects: () => get().projects.filter((p) => p.status === "active"),
}));
```

**Step 4: Run test to confirm it passes**

```bash
npx jest src/stores/__tests__/projectsStore.test.ts
```
Expected: PASS.

**Step 5: Create `src/screens/projects/ProjectFormScreen.tsx`**

```tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Project } from "../../types";

// Install if missing: npx expo install @react-native-picker/picker

type Props = { navigation: any };

export function ProjectFormScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goalId, setGoalId] = useState("");
  const [incomeType, setIncomeType] = useState<Project["income_type"]>("income");
  const { createProject } = useProjectsStore();
  const { activeGoals } = useGoalsStore();
  const { user } = useAuthStore();
  const goals = activeGoals();

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Error", "El nombre es obligatorio.");
    if (!goalId) return Alert.alert("Error", "Selecciona un objetivo.");
    if (!user) return;
    const error = await createProject(user.id, { name, description, goal_id: goalId, income_type: incomeType });
    if (error) Alert.alert("Error", error);
    else navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-lg font-semibold text-gray-700 mb-1">Nombre del proyecto</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿En qué estás trabajando?"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-lg font-semibold text-gray-700 mb-1">Descripción</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="¿Qué es y por qué importa?"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text className="text-lg font-semibold text-gray-700 mb-1">Objetivo asociado</Text>
      <View className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
        <Picker selectedValue={goalId} onValueChange={setGoalId}>
          <Picker.Item label="Selecciona un objetivo" value="" />
          {goals.map((g) => (
            <Picker.Item key={g.id} label={g.title} value={g.id} />
          ))}
        </Picker>
      </View>

      <Text className="text-lg font-semibold text-gray-700 mb-2">¿Genera ingresos?</Text>
      <View className="flex-row mb-8 gap-2">
        {(["income", "non_income"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            className={`flex-1 py-2 rounded-lg items-center border ${incomeType === type ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setIncomeType(type)}
          >
            <Text className={incomeType === type ? "text-white font-semibold" : "text-gray-700"}>
              {type === "income" ? "Sí, genera ingresos" : "No genera ingresos"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Guardar proyecto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

**Step 6: Create `src/screens/projects/ProjectListScreen.tsx`**

```tsx
import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Project } from "../../types";

function ProjectCard({ project, goalTitle }: { project: Project; goalTitle: string }) {
  const incomeLabel = project.income_type === "income" ? "💰 Ingresos" : "🧠 Sin ingresos";
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <Text className="text-base font-semibold text-gray-900">{project.name}</Text>
      <Text className="text-sm text-gray-500 mt-1">{goalTitle}</Text>
      <Text className="text-xs text-gray-400 mt-1">{incomeLabel}</Text>
    </View>
  );
}

type Props = { navigation: any };

export function ProjectListScreen({ navigation }: Props) {
  const { projects, fetchProjects } = useProjectsStore();
  const { goals, fetchGoals } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProjects(user.id);
      fetchGoals(user.id);
    }
  }, [user]);

  const getGoalTitle = (goalId: string) =>
    goals.find((g) => g.id === goalId)?.title ?? "Sin objetivo";

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Proyectos</Text>
        <TouchableOpacity
          className="bg-indigo-600 rounded-full px-4 py-2"
          onPress={() => navigation.navigate("ProjectForm")}
        >
          <Text className="text-white font-semibold">+ Nuevo</Text>
        </TouchableOpacity>
      </View>
      {projects.length === 0 && (
        <Text className="text-gray-400 text-center mt-16">
          Sin proyectos todavía.{"\n"}Primero crea un objetivo.
        </Text>
      )}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard project={item} goalTitle={getGoalTitle(item.goal_id)} />
        )}
      />
    </View>
  );
}
```

**Step 7: Update `src/screens/ProjectsScreen.tsx`**

```tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProjectListScreen } from "./projects/ProjectListScreen";
import { ProjectFormScreen } from "./projects/ProjectFormScreen";

const Stack = createNativeStackNavigator();

export function ProjectsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProjectList" component={ProjectListScreen} options={{ title: "Proyectos" }} />
      <Stack.Screen name="ProjectForm" component={ProjectFormScreen} options={{ title: "Nuevo Proyecto" }} />
    </Stack.Navigator>
  );
}
```

**Step 8: Install Picker**

```bash
npx expo install @react-native-picker/picker
```

**Step 9: Run all tests**

```bash
npx jest src/stores/
```
Expected: All store tests pass.

**Step 10: Commit**

```bash
git add src/stores/projectsStore.ts src/stores/__tests__/projectsStore.test.ts src/screens/projects/ src/screens/ProjectsScreen.tsx
git commit -m "feat: add projects store and Projects screens (list + form)"
```

---

---

## Wave 3 — Core Moment Agents (Tasks 10–11, parallel)

> Start both agents simultaneously after Wave 2's final commits. Each agent builds its store and isolated screen only — HomeScreen and navigation wiring is deferred to Wave 4.

---

## Task 10: Daily Focus Flow (Morning Ritual)
> **Agent: Focus Agent** | File boundary: `src/stores/focusStore.ts`, `src/stores/__tests__/focusStore.test.ts`, `src/screens/focus/MorningFocusScreen.tsx`
> **DO NOT modify** `src/screens/HomeScreen.tsx` or `src/navigation/index.tsx` — Integration Agent handles that in Wave 4

**Files:**
- Create: `src/stores/focusStore.ts`
- Create: `src/stores/__tests__/focusStore.test.ts`
- Create: `src/screens/focus/MorningFocusScreen.tsx`
- Modify: `src/screens/HomeScreen.tsx`

**Step 1: Write failing tests**

Create `src/stores/__tests__/focusStore.test.ts`:
```ts
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
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/stores/__tests__/focusStore.test.ts
```
Expected: FAIL.

**Step 3: Create `src/stores/focusStore.ts`**

```ts
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
    const { data } = await supabase
      .from("daily_focus")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .single();
    set({ todayFocus: data ?? null, loading: false });
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
```

**Step 4: Run test to confirm it passes**

```bash
npx jest src/stores/__tests__/focusStore.test.ts
```
Expected: PASS.

**Step 5: Create `src/screens/focus/MorningFocusScreen.tsx`**

```tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useFocusStore } from "../../stores/focusStore";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type Props = { navigation: any };

export function MorningFocusScreen({ navigation }: Props) {
  const [mainFocus, setMainFocus] = useState("");
  const [secondaryFocus, setSecondaryFocus] = useState("");
  const [intentionNotes, setIntentionNotes] = useState("");
  const { saveFocus, todayFocus } = useFocusStore();
  const { activeProjects } = useProjectsStore();
  const { activeGoals } = useGoalsStore();
  const { user } = useAuthStore();

  const goals = activeGoals();
  const projects = activeProjects();
  const today = getTodayDate();

  useEffect(() => {
    if (todayFocus) {
      setMainFocus(todayFocus.main_focus);
      setSecondaryFocus(todayFocus.secondary_focus);
      setIntentionNotes(todayFocus.intention_notes);
    }
  }, [todayFocus]);

  const handleSave = async () => {
    if (!mainFocus.trim()) return Alert.alert("Error", "Define tu foco principal.");
    if (!user) return;
    const error = await saveFocus(user.id, today, {
      main_focus: mainFocus,
      secondary_focus: secondaryFocus,
      intention_notes: intentionNotes,
    });
    if (error) Alert.alert("Error", error);
    else navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Decide tu día</Text>
      <Text className="text-gray-500 mb-6">¿En qué vas a invertir tu tiempo y energía hoy?</Text>

      {goals.length > 0 && (
        <View className="bg-indigo-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm font-semibold text-indigo-700 mb-2">Tus objetivos activos:</Text>
          {goals.map((g) => (
            <Text key={g.id} className="text-sm text-indigo-800 mb-1">• {g.title}</Text>
          ))}
        </View>
      )}

      <Text className="text-base font-semibold text-gray-700 mb-1">
        Foco principal <Text className="text-red-500">*</Text>
      </Text>
      <Text className="text-xs text-gray-400 mb-2">La única cosa que, si la haces, el día habrá valido la pena.</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿En qué se concentra toda tu energía hoy?"
        value={mainFocus}
        onChangeText={setMainFocus}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">Foco secundario</Text>
      <Text className="text-xs text-gray-400 mb-2">1-2 cosas importantes pero no urgentes.</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿Qué más puedes avanzar si hay tiempo?"
        value={secondaryFocus}
        onChangeText={setSecondaryFocus}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">Intención del día</Text>
      <Text className="text-xs text-gray-400 mb-2">¿Por qué es importante este foco hoy específicamente?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="¿Qué sacrificas para hacer esto? ¿Qué queda fuera hoy?"
        multiline
        value={intentionNotes}
        onChangeText={setIntentionNotes}
      />

      {projects.length > 0 && (
        <View className="bg-gray-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm font-semibold text-gray-600 mb-2">Proyectos activos como referencia:</Text>
          {projects.map((p) => (
            <Text key={p.id} className="text-sm text-gray-500 mb-1">
              {p.income_type === "income" ? "💰" : "🧠"} {p.name}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Confirmar mi foco</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

**Step 6: Update `src/screens/HomeScreen.tsx` with morning focus summary**

```tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useFocusStore } from "../stores/focusStore";
import { useAuthStore } from "../stores/authStore";
import { useGoalsStore } from "../stores/goalsStore";
import { useProjectsStore } from "../stores/projectsStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type Props = { navigation: any };

export function HomeScreen({ navigation }: Props) {
  const { todayFocus, fetchTodayFocus } = useFocusStore();
  const { activeGoals, fetchGoals } = useGoalsStore();
  const { activeProjects, fetchProjects } = useProjectsStore();
  const { user } = useAuthStore();
  const today = getTodayDate();

  useEffect(() => {
    if (user) {
      fetchTodayFocus(user.id, today);
      fetchGoals(user.id);
      fetchProjects(user.id);
    }
  }, [user]);

  const goals = activeGoals();
  const projects = activeProjects();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-8">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Hoy</Text>
      <Text className="text-gray-400 mb-6">{today}</Text>

      {!todayFocus ? (
        <View className="bg-indigo-50 rounded-2xl p-5 mb-4">
          <Text className="text-base font-semibold text-indigo-800 mb-2">
            ¿En qué vas a invertir tu energía hoy?
          </Text>
          <Text className="text-sm text-indigo-600 mb-4">
            Tómate 2 minutos para decidir antes de empezar.
          </Text>
          <TouchableOpacity
            className="bg-indigo-600 rounded-lg py-3 items-center"
            onPress={() => navigation.navigate("MorningFocus")}
          >
            <Text className="text-white font-semibold">Decidir mi día →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100">
          <Text className="text-sm font-semibold text-gray-400 mb-1">FOCO PRINCIPAL</Text>
          <Text className="text-base font-bold text-gray-900 mb-3">{todayFocus.main_focus}</Text>
          {todayFocus.secondary_focus ? (
            <>
              <Text className="text-sm font-semibold text-gray-400 mb-1">FOCO SECUNDARIO</Text>
              <Text className="text-sm text-gray-700">{todayFocus.secondary_focus}</Text>
            </>
          ) : null}
          <TouchableOpacity
            className="mt-3"
            onPress={() => navigation.navigate("MorningFocus")}
          >
            <Text className="text-indigo-600 text-sm">Editar foco del día</Text>
          </TouchableOpacity>
        </View>
      )}

      {goals.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-400 mb-2">OBJETIVOS ACTIVOS</Text>
          {goals.map((g) => (
            <View key={g.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">{g.title}</Text>
            </View>
          ))}
        </View>
      )}

      {projects.length > 0 && (
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-400 mb-2">PROYECTOS ACTIVOS</Text>
          {projects.map((p) => (
            <View key={p.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">
                {p.income_type === "income" ? "💰 " : "🧠 "}{p.name}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
```

**Step 7: Run tests**

```bash
npx jest src/stores/__tests__/focusStore.test.ts
```
Expected: PASS.

**Step 9: Commit**

```bash
git add src/stores/focusStore.ts src/stores/__tests__/focusStore.test.ts src/screens/focus/
git commit -m "feat: add daily focus store and morning focus screen"
```

---

## Task 11: Evening Journal Flow
> **Agent: Journal Agent** | File boundary: `src/stores/journalStore.ts`, `src/stores/__tests__/journalStore.test.ts`, `src/screens/journal/EveningJournalScreen.tsx`
> **DO NOT modify** `src/screens/HomeScreen.tsx` or `src/navigation/index.tsx` — Integration Agent handles that in Wave 4

**Files:**
- Create: `src/stores/journalStore.ts`
- Create: `src/stores/__tests__/journalStore.test.ts`
- Create: `src/screens/journal/EveningJournalScreen.tsx`

**Step 1: Write failing tests**

Create `src/stores/__tests__/journalStore.test.ts`:
```ts
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
        guided_answers: { what_happened: "", what_i_avoided: "", why: "", alignment_score: 4 },
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
```

**Step 2: Run test to confirm it fails**

```bash
npx jest src/stores/__tests__/journalStore.test.ts
```
Expected: FAIL.

**Step 3: Create `src/stores/journalStore.ts`**

```ts
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
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .single();
    set({ todayEntry: data ?? null, loading: false });
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
```

**Step 4: Run test to confirm it passes**

```bash
npx jest src/stores/__tests__/journalStore.test.ts
```
Expected: PASS.

**Step 5: Create `src/screens/journal/EveningJournalScreen.tsx`**

```tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useJournalStore } from "../../stores/journalStore";
import { useFocusStore } from "../../stores/focusStore";
import { useAuthStore } from "../../stores/authStore";
import type { GuidedAnswers } from "../../types";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type Props = { navigation: any };

const ALIGNMENT_LABELS = ["", "Muy desalineado", "Poco alineado", "Neutral", "Bastante alineado", "Totalmente alineado"];

export function EveningJournalScreen({ navigation }: Props) {
  const [freeText, setFreeText] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [whatAvoided, setWhatAvoided] = useState("");
  const [why, setWhy] = useState("");
  const [alignmentScore, setAlignmentScore] = useState<1 | 2 | 3 | 4 | 5>(3);

  const { saveEntry, todayEntry, fetchTodayEntry } = useJournalStore();
  const { todayFocus } = useFocusStore();
  const { user } = useAuthStore();
  const today = getTodayDate();

  useEffect(() => {
    if (user) fetchTodayEntry(user.id, today);
  }, [user]);

  useEffect(() => {
    if (todayEntry) {
      setFreeText(todayEntry.free_text);
      setWhatHappened(todayEntry.guided_answers.what_happened);
      setWhatAvoided(todayEntry.guided_answers.what_i_avoided);
      setWhy(todayEntry.guided_answers.why);
      setAlignmentScore(todayEntry.guided_answers.alignment_score);
    }
  }, [todayEntry]);

  const handleSave = async () => {
    if (!user) return;
    const guided_answers: GuidedAnswers = {
      what_happened: whatHappened,
      what_i_avoided: whatAvoided,
      why,
      alignment_score: alignmentScore,
    };
    const error = await saveEntry(user.id, today, {
      free_text: freeText,
      guided_answers,
      related_project_ids: [],
    });
    if (error) Alert.alert("Error", error);
    else {
      Alert.alert("¡Guardado!", "Tu reflexión del día está guardada.");
      navigation.goBack();
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Cierre del día</Text>
      <Text className="text-gray-500 mb-6">Convierte la acción en aprendizaje.</Text>

      {todayFocus && (
        <View className="bg-indigo-50 rounded-2xl p-4 mb-6">
          <Text className="text-xs font-semibold text-indigo-600 mb-1">Tu intención de hoy fue:</Text>
          <Text className="text-sm font-medium text-indigo-900">{todayFocus.main_focus}</Text>
        </View>
      )}

      <Text className="text-base font-semibold text-gray-700 mb-1">¿Qué pasó hoy?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="Sin juicio. ¿Qué hiciste realmente?"
        multiline
        value={whatHappened}
        onChangeText={setWhatHappened}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">¿Qué evitaste o pospusiste?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="Sé honesto contigo mismo."
        value={whatAvoided}
        onChangeText={setWhatAvoided}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">¿Por qué?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿Miedo? ¿Incertidumbre? ¿Energía?"
        value={why}
        onChangeText={setWhy}
      />

      <Text className="text-base font-semibold text-gray-700 mb-2">
        ¿Cómo de alineado te sientes con tus objetivos hoy?
      </Text>
      <View className="flex-row justify-between mb-4">
        {([1, 2, 3, 4, 5] as const).map((score) => (
          <TouchableOpacity
            key={score}
            className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
              alignmentScore === score
                ? "bg-indigo-600 border-indigo-600"
                : "border-gray-300"
            }`}
            onPress={() => setAlignmentScore(score)}
          >
            <Text className={alignmentScore === score ? "text-white font-bold" : "text-gray-600"}>
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-xs text-gray-400 mb-4 text-center">{ALIGNMENT_LABELS[alignmentScore]}</Text>

      <Text className="text-base font-semibold text-gray-700 mb-1">Notas libres (opcional)</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-8 text-gray-900 h-24"
        placeholder="Cualquier cosa que quieras recordar de hoy."
        multiline
        value={freeText}
        onChangeText={setFreeText}
      />

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Guardar reflexión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

**Step 6: Run all tests**

```bash
npx jest src/stores/__tests__/journalStore.test.ts
```
Expected: PASS.

**Step 7: Commit**

```bash
git add src/stores/journalStore.ts src/stores/__tests__/journalStore.test.ts src/screens/journal/
git commit -m "feat: add journal store and evening journal screen"
```

---

---

## Wave 4 — Integration Agent (Tasks 12–13, sequential)

> Start after Wave 3 commits. This agent owns all shared files: `HomeScreen.tsx`, `navigation/index.tsx`, plus the weekly review screen and final polish.

---

## Task 12: Wire Navigation + HomeScreen + Weekly Review

> **Agent: Integration Agent**

**Files:**
- Create: `src/screens/review/WeeklyReviewScreen.tsx`
- Modify: `src/navigation/index.tsx` (add HomeStack with MorningFocus, EveningJournal, WeeklyReview routes)
- Modify: `src/screens/HomeScreen.tsx` (full implementation: focus summary + morning/evening/review buttons)

> Note: Weekly review doesn't need its own store — it uses the existing projectsStore and goalsStore. The HomeScreen and navigation changes that were intentionally deferred from Tasks 10 and 11 are completed here.

**Step 1: Create `src/screens/review/WeeklyReviewScreen.tsx`**

```tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Project } from "../../types";

type Props = { navigation: any };

const projectStatusOptions: { label: string; value: Project["status"]; description: string }[] = [
  { label: "Continuar", value: "active", description: "Sigue siendo prioritario" },
  { label: "Pausar", value: "paused", description: "No es el momento" },
  { label: "Cerrar", value: "closed", description: "Ya no tiene sentido" },
];

function ProjectReviewCard({ project, onDecision }: {
  project: Project;
  onDecision: (id: string, status: Project["status"]) => void;
}) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
      <Text className="text-base font-semibold text-gray-900 mb-1">{project.name}</Text>
      <Text className="text-xs text-gray-400 mb-3">
        {project.income_type === "income" ? "💰 Genera ingresos" : "🧠 Sin ingresos directos"}
      </Text>
      <View className="flex-row gap-2">
        {projectStatusOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            className={`flex-1 py-2 rounded-lg items-center border ${
              project.status === opt.value
                ? "bg-indigo-600 border-indigo-600"
                : "border-gray-200"
            }`}
            onPress={() => onDecision(project.id, opt.value)}
          >
            <Text
              className={`text-xs font-semibold ${project.status === opt.value ? "text-white" : "text-gray-600"}`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function WeeklyReviewScreen({ navigation }: Props) {
  const { projects, fetchProjects, updateProject } = useProjectsStore();
  const { goals, fetchGoals } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProjects(user.id);
      fetchGoals(user.id);
    }
  }, [user]);

  const activeProjects = projects.filter((p) => p.status !== "closed");
  const activeGoals = goals.filter((g) => g.status === "active");

  const handleProjectDecision = async (id: string, status: Project["status"]) => {
    const error = await updateProject(id, { status });
    if (error) Alert.alert("Error", error);
  };

  const handleFinish = () => {
    Alert.alert("Revisión completada", "Que tengas una semana alineada.");
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Revisión semanal</Text>
      <Text className="text-gray-500 mb-6">Evalúa la coherencia de tu semana y decide qué continúa.</Text>

      {activeGoals.length > 0 && (
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-400 mb-2">OBJETIVOS ACTIVOS</Text>
          {activeGoals.map((g) => (
            <View key={g.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">{g.title}</Text>
              <Text className="text-xs text-gray-400">{g.horizon} · {g.dimension}</Text>
            </View>
          ))}
        </View>
      )}

      <Text className="text-sm font-semibold text-gray-400 mb-2">PROYECTOS — DECIDE QUÉ HACER</Text>
      {activeProjects.length === 0 && (
        <Text className="text-gray-400 text-center py-8">Sin proyectos activos para revisar.</Text>
      )}
      {activeProjects.map((p) => (
        <ProjectReviewCard key={p.id} project={p} onDecision={handleProjectDecision} />
      ))}

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mt-4 mb-8"
        onPress={handleFinish}
      >
        <Text className="text-white font-semibold text-base">Terminar revisión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

**Step 2: Update `src/navigation/index.tsx` with full HomeStack**

Replace the Home tab in `MainTabs` with a `HomeNavigator` stack that includes all three moment screens:

```tsx
import { MorningFocusScreen } from "../screens/focus/MorningFocusScreen";
import { EveningJournalScreen } from "../screens/journal/EveningJournalScreen";
import { WeeklyReviewScreen } from "../screens/review/WeeklyReviewScreen";

const HomeStack = createNativeStackNavigator();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: "Hoy" }} />
      <HomeStack.Screen name="MorningFocus" component={MorningFocusScreen} options={{ title: "Decide tu día" }} />
      <HomeStack.Screen name="EveningJournal" component={EveningJournalScreen} options={{ title: "Cierre del día" }} />
      <HomeStack.Screen name="WeeklyReview" component={WeeklyReviewScreen} options={{ title: "Revisión Semanal" }} />
    </HomeStack.Navigator>
  );
}
```

In `MainTabs`, replace the Home tab:
```tsx
<Tab.Screen name="Hoy" component={HomeNavigator} />
```

**Step 3: Implement full `src/screens/HomeScreen.tsx`**

Replace the placeholder HomeScreen with the full implementation (fetches todayFocus, goals, projects; shows morning focus CTA or summary; shows evening journal and weekly review buttons):

```tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useFocusStore } from "../stores/focusStore";
import { useAuthStore } from "../stores/authStore";
import { useGoalsStore } from "../stores/goalsStore";
import { useProjectsStore } from "../stores/projectsStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type Props = { navigation: any };

export function HomeScreen({ navigation }: Props) {
  const { todayFocus, fetchTodayFocus } = useFocusStore();
  const { activeGoals, fetchGoals } = useGoalsStore();
  const { activeProjects, fetchProjects } = useProjectsStore();
  const { user } = useAuthStore();
  const today = getTodayDate();

  useEffect(() => {
    if (user) {
      fetchTodayFocus(user.id, today);
      fetchGoals(user.id);
      fetchProjects(user.id);
    }
  }, [user]);

  const goals = activeGoals();
  const projects = activeProjects();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-8">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Hoy</Text>
      <Text className="text-gray-400 mb-6">{today}</Text>

      {!todayFocus ? (
        <View className="bg-indigo-50 rounded-2xl p-5 mb-4">
          <Text className="text-base font-semibold text-indigo-800 mb-2">
            ¿En qué vas a invertir tu energía hoy?
          </Text>
          <Text className="text-sm text-indigo-600 mb-4">
            Tómate 2 minutos para decidir antes de empezar.
          </Text>
          <TouchableOpacity
            className="bg-indigo-600 rounded-lg py-3 items-center"
            onPress={() => navigation.navigate("MorningFocus")}
          >
            <Text className="text-white font-semibold">Decidir mi día →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100">
          <Text className="text-sm font-semibold text-gray-400 mb-1">FOCO PRINCIPAL</Text>
          <Text className="text-base font-bold text-gray-900 mb-3">{todayFocus.main_focus}</Text>
          {todayFocus.secondary_focus ? (
            <>
              <Text className="text-sm font-semibold text-gray-400 mb-1">FOCO SECUNDARIO</Text>
              <Text className="text-sm text-gray-700">{todayFocus.secondary_focus}</Text>
            </>
          ) : null}
          <TouchableOpacity className="mt-3" onPress={() => navigation.navigate("MorningFocus")}>
            <Text className="text-indigo-600 text-sm">Editar foco del día</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center"
        onPress={() => navigation.navigate("EveningJournal")}
      >
        <Text className="text-xl mr-3">🌙</Text>
        <View>
          <Text className="text-sm font-semibold text-gray-800">Cerrar el día</Text>
          <Text className="text-xs text-gray-400">Reflexiona sobre lo que pasó</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 flex-row items-center"
        onPress={() => navigation.navigate("WeeklyReview")}
      >
        <Text className="text-xl mr-3">📊</Text>
        <View>
          <Text className="text-sm font-semibold text-gray-800">Revisión semanal</Text>
          <Text className="text-xs text-gray-400">Ajusta tus proyectos y prioridades</Text>
        </View>
      </TouchableOpacity>

      {goals.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-400 mb-2">OBJETIVOS ACTIVOS</Text>
          {goals.map((g) => (
            <View key={g.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">{g.title}</Text>
            </View>
          ))}
        </View>
      )}

      {projects.length > 0 && (
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-400 mb-2">PROYECTOS ACTIVOS</Text>
          {projects.map((p) => (
            <View key={p.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">
                {p.income_type === "income" ? "💰 " : "🧠 "}{p.name}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
```

**Step 4: Run all tests**

```bash
npx jest
```
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/screens/review/ src/navigation/ src/screens/HomeScreen.tsx
git commit -m "feat: wire navigation and home screen — morning focus, evening journal, weekly review"
```

---

## Task 13: Final Polish + Sign Out
> **Agent: Integration Agent** (continued)

**Files:**
- Modify: `src/screens/HomeScreen.tsx` (add sign out)
- Modify: `src/navigation/index.tsx` (header sign out button)

**Step 1: Add sign out to navigation header in `src/navigation/index.tsx`**

```tsx
// In MainTabs, add screenOptions to Tab.Navigator:
screenOptions={({ navigation }) => ({
  headerShown: true,
  headerRight: () => (
    <TouchableOpacity
      className="mr-4"
      onPress={() => useAuthStore.getState().signOut()}
    >
      <Text className="text-indigo-600">Salir</Text>
    </TouchableOpacity>
  ),
})}
```

Imports needed:
```tsx
import { TouchableOpacity, Text } from "react-native";
import { useAuthStore } from "../stores/authStore";
```

**Step 2: Run all tests**

```bash
npx jest
```
Expected: All tests pass.

**Step 3: Run the app end-to-end manually**

```bash
npx expo start
```

Verify manually:
- [ ] Register with a new email
- [ ] Sign in with that email
- [ ] Create a Goal
- [ ] Create a Project linked to that Goal
- [ ] Complete Morning Focus on Home screen
- [ ] Complete Evening Journal
- [ ] View Weekly Review and toggle project statuses
- [ ] Sign out

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: brainext MVP complete — morning focus, evening journal, weekly review, goals, projects"
```

---

## Summary

The MVP includes:
- **Auth**: Email/password via Supabase
- **Goals**: Create and manage life goals (priority, horizon, dimension)
- **Projects**: Create projects linked to goals, tagged as income/non-income
- **Morning Focus**: Daily decision ritual with active goals and projects as context
- **Evening Journal**: Guided reflection with alignment score
- **Weekly Review**: Project continue/pause/close decisions
- **Home Dashboard**: Daily status hub with quick access to all 3 key moments

---

## Out of Scope (Next Steps After MVP)

- AI-powered reflection prompts (Claude API integration)
- Push notifications for morning/evening reminders
- Onboarding flow for profile_type selection
- Actions (next actions) per project
- Historical journal browsing
- Analytics/charts on alignment scores over time
- Offline-first with local SQLite + sync
