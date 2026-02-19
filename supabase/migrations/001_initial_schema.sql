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
