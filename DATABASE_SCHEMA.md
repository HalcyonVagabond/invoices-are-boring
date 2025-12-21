# Database Schema for Invoices Are Boring

This document outlines the Supabase database schema for the premium features.

## SQL to run in Supabase SQL Editor

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    company_name text,
    email text,
    phone text,
    address text,
    city text,
    state text,
    zip text,
    country text,
    website text,
    logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table
create table public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    status text not null check (status in ('active', 'canceled', 'past_due', 'trialing', 'inactive')),
    plan text not null check (plan in ('free', 'pro', 'business')),
    stripe_customer_id text,
    stripe_subscription_id text,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organizations/Companies (for billing to/from)
create table public.organizations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    email text,
    phone text,
    address text,
    city text,
    state text,
    zip text,
    country text,
    website text,
    notes text,
    is_default_sender boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clients
create table public.clients (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    organization_id uuid references public.organizations on delete set null,
    name text not null,
    email text,
    phone text,
    address text,
    city text,
    state text,
    zip text,
    country text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved invoices
create table public.invoices (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    client_id uuid references public.clients on delete set null,
    title text not null default 'Invoice',
    invoice_number text,
    status text default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'canceled')),
    invoice_date date,
    due_date date,
    -- Bill from info
    from_name text,
    from_email text,
    from_phone text,
    from_address text,
    -- Bill to info
    to_name text,
    to_email text,
    to_phone text,
    to_address text,
    -- Invoice data (JSON for flexibility)
    line_items jsonb default '[]'::jsonb,
    taxes jsonb default '[]'::jsonb,
    discounts jsonb default '[]'::jsonb,
    custom_headers jsonb default '[]'::jsonb,
    -- Totals (calculated, stored for reporting)
    subtotal decimal(12,2) default 0,
    total_tax decimal(12,2) default 0,
    total_discount decimal(12,2) default 0,
    total decimal(12,2) default 0,
    -- Currency
    currency text default 'USD',
    -- Notes
    notes text,
    terms text,
    -- Logo
    logo_url text,
    -- Metadata
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    sent_at timestamp with time zone,
    paid_at timestamp with time zone
);

-- Invoice templates
create table public.invoice_templates (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    description text,
    -- Template data
    title text default 'Invoice',
    from_name text,
    from_email text,
    from_phone text,
    from_address text,
    line_items jsonb default '[]'::jsonb,
    taxes jsonb default '[]'::jsonb,
    discounts jsonb default '[]'::jsonb,
    custom_headers jsonb default '[]'::jsonb,
    notes text,
    terms text,
    logo_url text,
    currency text default 'USD',
    -- Metadata
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.organizations enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_templates enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
    for insert with check (auth.uid() = id);

-- Subscriptions policies
create policy "Users can view own subscription" on public.subscriptions
    for select using (auth.uid() = user_id);

-- Organizations policies
create policy "Users can view own organizations" on public.organizations
    for select using (auth.uid() = user_id);
create policy "Users can insert own organizations" on public.organizations
    for insert with check (auth.uid() = user_id);
create policy "Users can update own organizations" on public.organizations
    for update using (auth.uid() = user_id);
create policy "Users can delete own organizations" on public.organizations
    for delete using (auth.uid() = user_id);

-- Clients policies
create policy "Users can view own clients" on public.clients
    for select using (auth.uid() = user_id);
create policy "Users can insert own clients" on public.clients
    for insert with check (auth.uid() = user_id);
create policy "Users can update own clients" on public.clients
    for update using (auth.uid() = user_id);
create policy "Users can delete own clients" on public.clients
    for delete using (auth.uid() = user_id);

-- Invoices policies
create policy "Users can view own invoices" on public.invoices
    for select using (auth.uid() = user_id);
create policy "Users can insert own invoices" on public.invoices
    for insert with check (auth.uid() = user_id);
create policy "Users can update own invoices" on public.invoices
    for update using (auth.uid() = user_id);
create policy "Users can delete own invoices" on public.invoices
    for delete using (auth.uid() = user_id);

-- Invoice templates policies
create policy "Users can view own templates" on public.invoice_templates
    for select using (auth.uid() = user_id);
create policy "Users can insert own templates" on public.invoice_templates
    for insert with check (auth.uid() = user_id);
create policy "Users can update own templates" on public.invoice_templates
    for update using (auth.uid() = user_id);
create policy "Users can delete own templates" on public.invoice_templates
    for delete using (auth.uid() = user_id);

-- Function to automatically create a profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, email)
    values (new.id, new.raw_user_meta_data->>'full_name', new.email);
    
    -- Also create a free subscription
    insert into public.subscriptions (user_id, status, plan)
    values (new.id, 'active', 'free');
    
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
create trigger update_profiles_updated_at before update on public.profiles
    for each row execute procedure public.update_updated_at_column();
create trigger update_subscriptions_updated_at before update on public.subscriptions
    for each row execute procedure public.update_updated_at_column();
create trigger update_organizations_updated_at before update on public.organizations
    for each row execute procedure public.update_updated_at_column();
create trigger update_clients_updated_at before update on public.clients
    for each row execute procedure public.update_updated_at_column();
create trigger update_invoices_updated_at before update on public.invoices
    for each row execute procedure public.update_updated_at_column();
create trigger update_invoice_templates_updated_at before update on public.invoice_templates
    for each row execute procedure public.update_updated_at_column();

-- Create storage bucket for logos
insert into storage.buckets (id, name, public) values ('logos', 'logos', true);

-- Storage policies for logos
create policy "Users can upload their own logo" on storage.objects
    for insert with check (
        bucket_id = 'logos' and 
        auth.uid()::text = (storage.foldername(name))[1]
    );
create policy "Users can update their own logo" on storage.objects
    for update using (
        bucket_id = 'logos' and 
        auth.uid()::text = (storage.foldername(name))[1]
    );
create policy "Users can delete their own logo" on storage.objects
    for delete using (
        bucket_id = 'logos' and 
        auth.uid()::text = (storage.foldername(name))[1]
    );
create policy "Logos are publicly viewable" on storage.objects
    for select using (bucket_id = 'logos');
```

## Feature Limits by Plan

| Feature | Free | Pro ($9/mo) | Business ($19/mo) |
|---------|------|-------------|-------------------|
| Saved Invoices | 5 | Unlimited | Unlimited |
| Clients | 3 | Unlimited | Unlimited |
| Organizations | 1 | 5 | Unlimited |
| Templates | 1 | 10 | Unlimited |
| Logo Upload | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ✅ |
| Invoice Analytics | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |

## Setup Steps

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL above to create all tables and policies
4. Enable Email auth in Authentication > Providers
5. (Optional) Enable Google OAuth in Authentication > Providers
6. Create a Storage bucket called 'logos' if not auto-created
7. Set up Stripe integration for subscriptions (separate setup)
