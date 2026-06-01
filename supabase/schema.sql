-- ============================================================
-- ECK FITNESS — Prode Mundial 2026 — Supabase Schema
-- ============================================================

-- Profiles (extiende auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  member_number text,
  created_at timestamptz default now()
);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, member_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'member_number'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Prode
-- ============================================================

create table public.prode_matches (
  id uuid default gen_random_uuid() primary key,
  phase text not null check (phase in ('grupos', 'r32', 'octavos', 'cuartos', 'semifinal', 'tercer_puesto', 'final')),
  group_name text,
  home_team text not null check (length(home_team) between 1 and 60),
  away_team text not null check (length(away_team) between 1 and 60),
  match_date timestamptz not null,
  home_score integer check (home_score is null or home_score between 0 and 20),
  away_score integer check (away_score is null or away_score between 0 and 20),
  is_closed boolean default false,
  created_at timestamptz default now()
);

create index prode_matches_phase_idx on public.prode_matches(phase);
create index prode_matches_date_idx on public.prode_matches(match_date);

create table public.prode_predictions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  match_id uuid references public.prode_matches(id) on delete cascade not null,
  home_score integer not null check (home_score between 0 and 20),
  away_score integer not null check (away_score between 0 and 20),
  points integer check (points is null or points between 0 and 3),
  created_at timestamptz default now(),
  unique (user_id, match_id)
);

create index prode_predictions_user_id_idx on public.prode_predictions(user_id);
create index prode_predictions_match_id_idx on public.prode_predictions(match_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.prode_matches enable row level security;
alter table public.prode_predictions enable row level security;

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Profiles
create policy "Profiles visibles para todos los logueados"
  on public.profiles for select using (auth.role() = 'authenticated');
create policy "Usuarios actualizan su perfil"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins gestionan profiles"
  on public.profiles for all using (public.current_user_role() = 'admin');

-- Matches (lectura pública, escritura admin)
create policy "Matches visibles para todos"
  on public.prode_matches for select using (true);
create policy "Admins gestionan matches"
  on public.prode_matches for all using (public.current_user_role() = 'admin');

-- Predictions
create policy "Predictions visibles para todos los logueados"
  on public.prode_predictions for select using (auth.role() = 'authenticated');

-- Solo permite crear/editar pronósticos si el partido todavía no empezó y no está cerrado.
-- La UI replica esta regla pero el backend es la fuente de verdad: nadie puede
-- mandar un pronóstico tarde aunque haga curl directo a Supabase.
create policy "Usuarios crean predictions si el partido sigue abierto"
  on public.prode_predictions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.prode_matches m
      where m.id = match_id
        and m.is_closed = false
        and m.match_date > now()
    )
  );
create policy "Usuarios actualizan predictions si el partido sigue abierto"
  on public.prode_predictions for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.prode_matches m
      where m.id = match_id
        and m.is_closed = false
        and m.match_date > now()
    )
  );
create policy "Usuarios borran sus predictions"
  on public.prode_predictions for delete using (auth.uid() = user_id);
create policy "Admins gestionan predictions"
  on public.prode_predictions for all using (public.current_user_role() = 'admin');

-- ============================================================
-- Seed Mundial 2026 — 72 partidos de grupos + 32 knockout
-- Equipos basados en clasificados conocidos al 2026. Grupos hipotéticos
-- (ajustar con UPDATE post-sorteo oficial FIFA si difiere).
-- ============================================================

insert into public.prode_matches (phase, group_name, home_team, away_team, match_date, is_closed) values
  ('grupos', 'A', 'México', 'Suiza', '2026-06-11 15:00-03', false),
  ('grupos', 'A', 'Marruecos', 'Australia', '2026-06-11 21:00-03', false),
  ('grupos', 'A', 'México', 'Marruecos', '2026-06-16 15:00-03', false),
  ('grupos', 'A', 'Suiza', 'Australia', '2026-06-16 21:00-03', false),
  ('grupos', 'A', 'México', 'Australia', '2026-06-22 15:00-03', false),
  ('grupos', 'A', 'Suiza', 'Marruecos', '2026-06-22 21:00-03', false),
  ('grupos', 'B', 'Canadá', 'Bélgica', '2026-06-11 15:00-03', false),
  ('grupos', 'B', 'Argelia', 'Uzbekistán', '2026-06-11 21:00-03', false),
  ('grupos', 'B', 'Canadá', 'Argelia', '2026-06-16 15:00-03', false),
  ('grupos', 'B', 'Bélgica', 'Uzbekistán', '2026-06-16 21:00-03', false),
  ('grupos', 'B', 'Canadá', 'Uzbekistán', '2026-06-22 15:00-03', false),
  ('grupos', 'B', 'Bélgica', 'Argelia', '2026-06-22 21:00-03', false),
  ('grupos', 'C', 'EEUU', 'Croacia', '2026-06-12 15:00-03', false),
  ('grupos', 'C', 'Egipto', 'Corea del Sur', '2026-06-12 21:00-03', false),
  ('grupos', 'C', 'EEUU', 'Egipto', '2026-06-17 15:00-03', false),
  ('grupos', 'C', 'Croacia', 'Corea del Sur', '2026-06-17 21:00-03', false),
  ('grupos', 'C', 'EEUU', 'Corea del Sur', '2026-06-23 15:00-03', false),
  ('grupos', 'C', 'Croacia', 'Egipto', '2026-06-23 21:00-03', false),
  ('grupos', 'D', 'Argentina', 'Polonia', '2026-06-12 15:00-03', false),
  ('grupos', 'D', 'Senegal', 'Arabia Saudí', '2026-06-12 21:00-03', false),
  ('grupos', 'D', 'Argentina', 'Senegal', '2026-06-17 15:00-03', false),
  ('grupos', 'D', 'Polonia', 'Arabia Saudí', '2026-06-17 21:00-03', false),
  ('grupos', 'D', 'Argentina', 'Arabia Saudí', '2026-06-23 15:00-03', false),
  ('grupos', 'D', 'Polonia', 'Senegal', '2026-06-23 21:00-03', false),
  ('grupos', 'E', 'Brasil', 'Austria', '2026-06-13 15:00-03', false),
  ('grupos', 'E', 'Costa de Marfil', 'Japón', '2026-06-13 21:00-03', false),
  ('grupos', 'E', 'Brasil', 'Costa de Marfil', '2026-06-18 15:00-03', false),
  ('grupos', 'E', 'Austria', 'Japón', '2026-06-18 21:00-03', false),
  ('grupos', 'E', 'Brasil', 'Japón', '2026-06-24 15:00-03', false),
  ('grupos', 'E', 'Austria', 'Costa de Marfil', '2026-06-24 21:00-03', false),
  ('grupos', 'F', 'Francia', 'Dinamarca', '2026-06-13 15:00-03', false),
  ('grupos', 'F', 'Túnez', 'Irán', '2026-06-13 21:00-03', false),
  ('grupos', 'F', 'Francia', 'Túnez', '2026-06-18 15:00-03', false),
  ('grupos', 'F', 'Dinamarca', 'Irán', '2026-06-18 21:00-03', false),
  ('grupos', 'F', 'Francia', 'Irán', '2026-06-24 15:00-03', false),
  ('grupos', 'F', 'Dinamarca', 'Túnez', '2026-06-24 21:00-03', false),
  ('grupos', 'G', 'España', 'Serbia', '2026-06-14 15:00-03', false),
  ('grupos', 'G', 'Nigeria', 'Qatar', '2026-06-14 21:00-03', false),
  ('grupos', 'G', 'España', 'Nigeria', '2026-06-19 15:00-03', false),
  ('grupos', 'G', 'Serbia', 'Qatar', '2026-06-19 21:00-03', false),
  ('grupos', 'G', 'España', 'Qatar', '2026-06-25 15:00-03', false),
  ('grupos', 'G', 'Serbia', 'Nigeria', '2026-06-25 21:00-03', false),
  ('grupos', 'H', 'Inglaterra', 'Turquía', '2026-06-14 15:00-03', false),
  ('grupos', 'H', 'Camerún', 'Jordania', '2026-06-14 21:00-03', false),
  ('grupos', 'H', 'Inglaterra', 'Camerún', '2026-06-19 15:00-03', false),
  ('grupos', 'H', 'Turquía', 'Jordania', '2026-06-19 21:00-03', false),
  ('grupos', 'H', 'Inglaterra', 'Jordania', '2026-06-25 15:00-03', false),
  ('grupos', 'H', 'Turquía', 'Camerún', '2026-06-25 21:00-03', false),
  ('grupos', 'I', 'Alemania', 'Noruega', '2026-06-11 15:00-03', false),
  ('grupos', 'I', 'Ghana', 'Irak', '2026-06-11 21:00-03', false),
  ('grupos', 'I', 'Alemania', 'Ghana', '2026-06-16 15:00-03', false),
  ('grupos', 'I', 'Noruega', 'Irak', '2026-06-16 21:00-03', false),
  ('grupos', 'I', 'Alemania', 'Irak', '2026-06-22 15:00-03', false),
  ('grupos', 'I', 'Noruega', 'Ghana', '2026-06-22 21:00-03', false),
  ('grupos', 'J', 'Portugal', 'Italia', '2026-06-12 15:00-03', false),
  ('grupos', 'J', 'Sudáfrica', 'Nueva Zelanda', '2026-06-12 21:00-03', false),
  ('grupos', 'J', 'Portugal', 'Sudáfrica', '2026-06-17 15:00-03', false),
  ('grupos', 'J', 'Italia', 'Nueva Zelanda', '2026-06-17 21:00-03', false),
  ('grupos', 'J', 'Portugal', 'Nueva Zelanda', '2026-06-23 15:00-03', false),
  ('grupos', 'J', 'Italia', 'Sudáfrica', '2026-06-23 21:00-03', false),
  ('grupos', 'K', 'Países Bajos', 'Ecuador', '2026-06-13 15:00-03', false),
  ('grupos', 'K', 'Paraguay', 'Curazao', '2026-06-13 21:00-03', false),
  ('grupos', 'K', 'Países Bajos', 'Paraguay', '2026-06-18 15:00-03', false),
  ('grupos', 'K', 'Ecuador', 'Curazao', '2026-06-18 21:00-03', false),
  ('grupos', 'K', 'Países Bajos', 'Curazao', '2026-06-24 15:00-03', false),
  ('grupos', 'K', 'Ecuador', 'Paraguay', '2026-06-24 21:00-03', false),
  ('grupos', 'L', 'Uruguay', 'Colombia', '2026-06-14 15:00-03', false),
  ('grupos', 'L', 'Panamá', 'Costa Rica', '2026-06-14 21:00-03', false),
  ('grupos', 'L', 'Uruguay', 'Panamá', '2026-06-19 15:00-03', false),
  ('grupos', 'L', 'Colombia', 'Costa Rica', '2026-06-19 21:00-03', false),
  ('grupos', 'L', 'Uruguay', 'Costa Rica', '2026-06-25 15:00-03', false),
  ('grupos', 'L', 'Colombia', 'Panamá', '2026-06-25 21:00-03', false),
  ('r32', null, '1° A', '3° C/D/E/F', '2026-06-28 13:00-03', false),
  ('r32', null, '1° B', '3° A/D/E/F', '2026-06-28 17:00-03', false),
  ('r32', null, '1° C', '3° A/B/F/H', '2026-06-28 21:00-03', false),
  ('r32', null, '1° D', '3° B/E/F/G', '2026-06-29 13:00-03', false),
  ('r32', null, '1° E', '2° K', '2026-06-29 17:00-03', false),
  ('r32', null, '1° F', '2° I', '2026-06-29 21:00-03', false),
  ('r32', null, '1° G', '2° J', '2026-06-30 13:00-03', false),
  ('r32', null, '1° H', '2° L', '2026-06-30 17:00-03', false),
  ('r32', null, '1° I', '2° H', '2026-06-30 21:00-03', false),
  ('r32', null, '1° J', '2° G', '2026-07-01 13:00-03', false),
  ('r32', null, '1° K', '2° E', '2026-07-01 17:00-03', false),
  ('r32', null, '1° L', '2° F', '2026-07-01 21:00-03', false),
  ('r32', null, '2° A', '2° B', '2026-07-02 13:00-03', false),
  ('r32', null, '2° C', '2° D', '2026-07-02 17:00-03', false),
  ('r32', null, '3° G/H/I/J', '1° I-J', '2026-07-02 21:00-03', false),
  ('r32', null, '3° K/L', '1° K-L', '2026-07-03 17:00-03', false),
  ('octavos', null, 'G R32-1', 'G R32-2', '2026-07-04 13:00-03', false),
  ('octavos', null, 'G R32-3', 'G R32-4', '2026-07-04 17:00-03', false),
  ('octavos', null, 'G R32-5', 'G R32-6', '2026-07-04 21:00-03', false),
  ('octavos', null, 'G R32-7', 'G R32-8', '2026-07-05 13:00-03', false),
  ('octavos', null, 'G R32-9', 'G R32-10', '2026-07-05 17:00-03', false),
  ('octavos', null, 'G R32-11', 'G R32-12', '2026-07-05 21:00-03', false),
  ('octavos', null, 'G R32-13', 'G R32-14', '2026-07-06 17:00-03', false),
  ('octavos', null, 'G R32-15', 'G R32-16', '2026-07-07 17:00-03', false),
  ('cuartos', null, 'G Oct-1', 'G Oct-2', '2026-07-09 17:00-03', false),
  ('cuartos', null, 'G Oct-3', 'G Oct-4', '2026-07-09 21:00-03', false),
  ('cuartos', null, 'G Oct-5', 'G Oct-6', '2026-07-11 17:00-03', false),
  ('cuartos', null, 'G Oct-7', 'G Oct-8', '2026-07-11 21:00-03', false),
  ('semifinal', null, 'G Cuartos-1', 'G Cuartos-2', '2026-07-14 17:00-03', false),
  ('semifinal', null, 'G Cuartos-3', 'G Cuartos-4', '2026-07-15 17:00-03', false),
  ('tercer_puesto', null, 'P Semi-1', 'P Semi-2', '2026-07-18 16:00-03', false),
  ('final', null, 'G Semi-1', 'G Semi-2', '2026-07-19 16:00-03', false);

-- Total: 104 partidos

-- Para hacer admin a un usuario después de registrarse:
-- update public.profiles set role = 'admin' where email = 'tu@email.com';
