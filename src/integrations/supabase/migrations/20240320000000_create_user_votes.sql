-- Drop existing policies if they exist
drop policy if exists "Users can view their own votes" on public.user_votes;
drop policy if exists "Users can insert their own votes" on public.user_votes;
drop policy if exists "Users can update their own votes" on public.user_votes;
drop policy if exists "Users can delete their own votes" on public.user_votes;

-- Create user_votes table to track voting history
create table if not exists public.user_votes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    tea_shop_id uuid references public.tea_shops on delete cascade not null,
    vote_type text check (vote_type in ('upvote', 'downvote')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, tea_shop_id)
);

-- Enable RLS
alter table public.user_votes enable row level security;

-- Create policies
create policy "Users can view their own votes"
    on public.user_votes for select
    using (auth.uid() = user_id);

create policy "Users can insert their own votes"
    on public.user_votes for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own votes"
    on public.user_votes for update
    using (auth.uid() = user_id);

create policy "Users can delete their own votes"
    on public.user_votes for delete
    using (auth.uid() = user_id); 