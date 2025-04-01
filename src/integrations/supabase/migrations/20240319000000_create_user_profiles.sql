-- Create user_profiles table
create table if not exists public.user_profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique not null,
    role text check (role in ('user', 'admin')) default 'user' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can view user profiles" on public.user_profiles;
drop policy if exists "Users can update their own profile" on public.user_profiles;

-- Create policies
create policy "Anyone can view user profiles"
    on public.user_profiles for select
    using (true);

create policy "Users can update their own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

-- Add updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger user_profiles_updated_at
    before update on public.user_profiles
    for each row
    execute function public.handle_updated_at();

-- Create a trigger to automatically create a user profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, username)
    values (new.id, new.raw_user_meta_data->>'username' or new.email);
    return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user(); 