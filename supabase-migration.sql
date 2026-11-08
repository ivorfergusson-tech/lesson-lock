-- LessonLock schema (apply in Supabase SQL editor)
-- Tables: tutors (profile), policies, lessons, protected_bookings

create table if not exists public.tutors (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  stripe_account_id text,
  stripe_onboarded boolean default false,
  stripe_customer_id text,
  subscription_status text default 'inactive' check (subscription_status in ('inactive','active','past_due','canceled')),
  tier text default 'starter' check (tier in ('starter','pro')),
  created_at timestamptz default now()
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references public.tutors(id) on delete cascade,
  name text not null,
  template_key text,
  cancel_window_hours int not null default 24,
  kept_fee_percent int not null default 50 check (kept_fee_percent between 0 and 100),
  cap_cents int not null default 5000,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.protected_bookings (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references public.tutors(id) on delete cascade,
  policy_id uuid references public.policies(id),
  student_name text,
  student_email text,
  stripe_customer_id text,
  stripe_payment_method_id text,
  stripe_account_id text,
  created_at timestamptz default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references public.tutors(id) on delete cascade,
  policy_id uuid references public.policies(id),
  student_name text not null,
  student_email text,
  student_phone text,
  scheduled_at timestamptz not null,
  rate_cents int not null,
  status text default 'scheduled' check (status in ('scheduled','completed','no_show','late_cancel','charged','refunded')),
  charge_id text,
  charged_cents int,
  created_at timestamptz default now()
);

alter table public.tutors enable row level security;
alter table public.policies enable row level security;
alter table public.lessons enable row level security;

create policy "tutors self" on public.tutors for all using (auth.uid() = id);
create policy "policies owner" on public.policies for all using (auth.uid() = tutor_id);
create policy "lessons owner" on public.lessons for all using (auth.uid() = tutor_id);

-- auto-create tutor profile on signup
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.tutors (id, email) values (new.id, new.email) on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- add subscription columns if missing
alter table public.tutors add column if not exists stripe_customer_id text;
alter table public.tutors add column if not exists subscription_status text default 'inactive';
