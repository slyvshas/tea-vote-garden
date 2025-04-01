-- Drop existing table and policies if they exist
drop policy if exists "Anyone can view tea shops" on public.tea_shops;
drop policy if exists "Admins can insert tea shops" on public.tea_shops;
drop policy if exists "Admins can update tea shops" on public.tea_shops;
drop policy if exists "Admins can delete tea shops" on public.tea_shops;
drop table if exists public.tea_shops;

-- Create tea_shops table
create table if not exists public.tea_shops (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text not null,
    address text not null,
    image text not null,
    specialty text not null,
    hours jsonb not null,
    tags text[] not null default '{}',
    rating float not null default 0,
    votes jsonb not null default '{"upvotes": 0, "downvotes": 0}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tea_shops enable row level security;

-- Create policies
create policy "Anyone can view tea shops"
    on public.tea_shops for select
    using (true);

create policy "Admins can insert tea shops"
    on public.tea_shops for insert
    with check (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

create policy "Admins can update tea shops"
    on public.tea_shops for update
    using (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

create policy "Admins can delete tea shops"
    on public.tea_shops for delete
    using (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Add updated_at trigger
create trigger tea_shops_updated_at
    before update on public.tea_shops
    for each row
    execute function public.handle_updated_at();

-- Create index for faster searches
create index tea_shops_name_idx on public.tea_shops using gin (to_tsvector('english', name));
create index tea_shops_description_idx on public.tea_shops using gin (to_tsvector('english', description));
create index tea_shops_tags_idx on public.tea_shops using gin (tags); 