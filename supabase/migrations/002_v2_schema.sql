-- V2 Schema Migration

-- 1. Make profile_type nullable (onboarding sets it; null = not yet onboarded)
alter table public.profiles
  alter column profile_type drop not null,
  alter column profile_type drop default;

-- 2. Add business_owner to allowed values
alter table public.profiles
  drop constraint if exists profiles_profile_type_check;

alter table public.profiles
  add constraint profiles_profile_type_check
  check (profile_type in ('freelancer', 'entrepreneur', 'creative', 'business_owner'));

-- 3. Fix RLS: replace 'FOR ALL USING' with separate explicit policies
-- INSERT requires WITH CHECK; the old 'for all using' silently rejects inserts.

-- profiles
drop policy if exists "Users can manage own profile" on public.profiles;
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "profiles_delete" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete" on public.profiles
  for delete using (auth.uid() = id);

-- goals
drop policy if exists "Users can manage own goals" on public.goals;
drop policy if exists "goals_select" on public.goals;
drop policy if exists "goals_insert" on public.goals;
drop policy if exists "goals_update" on public.goals;
drop policy if exists "goals_delete" on public.goals;
create policy "goals_select" on public.goals
  for select using (auth.uid() = user_id);
create policy "goals_insert" on public.goals
  for insert with check (auth.uid() = user_id);
create policy "goals_update" on public.goals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_delete" on public.goals
  for delete using (auth.uid() = user_id);

-- projects
drop policy if exists "Users can manage own projects" on public.projects;
drop policy if exists "projects_select" on public.projects;
drop policy if exists "projects_insert" on public.projects;
drop policy if exists "projects_update" on public.projects;
drop policy if exists "projects_delete" on public.projects;
create policy "projects_select" on public.projects
  for select using (auth.uid() = user_id);
create policy "projects_insert" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "projects_update" on public.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_delete" on public.projects
  for delete using (auth.uid() = user_id);

-- actions
drop policy if exists "Users can manage own actions" on public.actions;
drop policy if exists "actions_select" on public.actions;
drop policy if exists "actions_insert" on public.actions;
drop policy if exists "actions_update" on public.actions;
drop policy if exists "actions_delete" on public.actions;
create policy "actions_select" on public.actions
  for select using (auth.uid() = user_id);
create policy "actions_insert" on public.actions
  for insert with check (auth.uid() = user_id);
create policy "actions_update" on public.actions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "actions_delete" on public.actions
  for delete using (auth.uid() = user_id);

-- daily_focus
drop policy if exists "Users can manage own focus" on public.daily_focus;
drop policy if exists "daily_focus_select" on public.daily_focus;
drop policy if exists "daily_focus_insert" on public.daily_focus;
drop policy if exists "daily_focus_update" on public.daily_focus;
drop policy if exists "daily_focus_delete" on public.daily_focus;
create policy "daily_focus_select" on public.daily_focus
  for select using (auth.uid() = user_id);
create policy "daily_focus_insert" on public.daily_focus
  for insert with check (auth.uid() = user_id);
create policy "daily_focus_update" on public.daily_focus
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_focus_delete" on public.daily_focus
  for delete using (auth.uid() = user_id);

-- journal_entries
drop policy if exists "Users can manage own journal" on public.journal_entries;
drop policy if exists "journal_select" on public.journal_entries;
drop policy if exists "journal_insert" on public.journal_entries;
drop policy if exists "journal_update" on public.journal_entries;
drop policy if exists "journal_delete" on public.journal_entries;
create policy "journal_select" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "journal_insert" on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy "journal_update" on public.journal_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journal_delete" on public.journal_entries
  for delete using (auth.uid() = user_id);
