-- Clean up duplicate tea shops based on name and address
with duplicates as (
    select name, address, count(*)
    from public.tea_shops
    group by name, address
    having count(*) > 1
)
delete from public.tea_shops
where (name, address) in (
    select name, address
    from duplicates
)
and id not in (
    select min(id)
    from public.tea_shops
    where (name, address) in (
        select name, address
        from duplicates
    )
    group by name, address
);

-- Clean up orphaned votes
delete from public.user_votes
where tea_shop_id not in (
    select id from public.tea_shops
);

-- Clean up orphaned user profiles
delete from public.user_profiles
where id not in (
    select id from auth.users
);

-- Ensure all tea shops have valid votes structure
update public.tea_shops
set votes = '{"upvotes": 0, "downvotes": 0}'::jsonb
where votes is null or votes::text = 'null';

-- Ensure all tea shops have valid hours structure
update public.tea_shops
set hours = '{"open": "9:00 AM", "close": "5:00 PM"}'::jsonb
where hours is null or hours::text = 'null';

-- Ensure all tea shops have valid tags array
update public.tea_shops
set tags = '{}'
where tags is null;

-- Add unique constraint to prevent future duplicates
alter table public.tea_shops
add constraint unique_tea_shop_name_address
unique (name, address);

-- Add foreign key constraint to ensure votes reference valid tea shops
alter table public.user_votes
add constraint fk_tea_shop
foreign key (tea_shop_id)
references public.tea_shops(id)
on delete cascade;

-- Add foreign key constraint to ensure user profiles reference valid users
alter table public.user_profiles
add constraint fk_auth_user
foreign key (id)
references auth.users(id)
on delete cascade; 