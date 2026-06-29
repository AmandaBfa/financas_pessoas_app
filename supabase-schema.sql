-- ============================================================
-- Finanças Pessoais App — Schema do banco de dados (Supabase)
-- Execute este script no SQL Editor do painel do Supabase.
-- ============================================================

-- Tabela de transações
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null,
  amount numeric(14, 2) not null check (amount >= 0),
  type text not null check (type in ('income', 'expense')),
  category text not null,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Índices para acelerar filtros por usuário e data
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_date_idx on public.transactions (date);

-- ============================================================
-- Row Level Security (RLS)
-- Cada usuário só acessa as próprias transações.
-- ============================================================
alter table public.transactions enable row level security;

drop policy if exists "Usuários podem ver suas transações" on public.transactions;
create policy "Usuários podem ver suas transações"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Usuários podem inserir suas transações" on public.transactions;
create policy "Usuários podem inserir suas transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar suas transações" on public.transactions;
create policy "Usuários podem atualizar suas transações"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Usuários podem excluir suas transações" on public.transactions;
create policy "Usuários podem excluir suas transações"
  on public.transactions for delete
  using (auth.uid() = user_id);
