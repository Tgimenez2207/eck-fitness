# ECK FITNESS · Prode Mundial 2026

Web del gym ECK FITNESS para el prode del Mundial. Inspirada en el módulo de prode de Newbery Athletic Club.

## Stack
- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn-style components
- **Supabase** (auth + Postgres) — opcional, hay modo demo sin backend
- **Sonner** para toasts, **lucide-react** para iconos

## Cómo se juega
- **3 puntos** si pegás el resultado exacto.
- **1 punto** si acertás el ganador (o empate).
- **0 puntos** si te equivocás.

## Rutas
- `/` — landing institucional con CTA al prode.
- `/demo` — versión sin Supabase. Tus pronósticos se guardan en `localStorage`. Sirve para que cualquiera vea cómo funciona sin setup.
- `/prode` — versión real con Supabase. Requiere login.
- `/auth/login`, `/auth/register` — auth con email/contraseña.
- `/auth/forgot-password` — pide email y manda link de recovery.
- `/auth/reset-password` — destino del link; seteás la nueva contraseña.
- `/admin/prode` — alta de partidos, cierre, carga de resultados y leaderboard. Solo para usuarios con `role = 'admin'`.

## Branding meta (auto)
- `src/app/icon.tsx` + `apple-icon.tsx` — favicon 512×512 y Apple icon 180×180 generados con `next/og`.
- `src/app/opengraph-image.tsx` + `twitter-image.tsx` — preview 1200×630 para WhatsApp / IG / Twitter cuando comparten el link.

## Auto-cierre de pronósticos
La UI cierra el partido apenas suena la hora (`isMatchClosed` en `lib/prode-utils.ts` + tick cada 30s con `useNow`). El backend rechaza inserts/updates tardíos vía RLS (`m.is_closed = false and m.match_date > now()`). `is_closed` queda como override manual del admin si hay que cerrar antes.

## Run local
```bash
npm run dev
```
Levanta en **http://localhost:8117**.

Si no configurás Supabase, todas las rutas de auth/prode redirigen a `/demo` automáticamente.

## Setup Supabase (opcional)
1. Creá un proyecto en [supabase.com](https://supabase.com/).
2. Copiá las credenciales a `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Corré el `supabase/schema.sql` en el SQL editor — crea las tablas (`profiles`, `prode_matches`, `prode_predictions`), policies de RLS, el trigger de `handle_new_user` y seed con los partidos de grupos del Mundial 2026.
4. Para hacer admin a un usuario después de registrarse:
   ```sql
   update public.profiles set role = 'admin' where email = 'tu@email.com';
   ```

## Carpeta clave
```
src/
├── app/
│   ├── page.tsx              ← landing
│   ├── demo/                 ← prode sin backend (localStorage)
│   ├── prode/                ← prode con Supabase
│   ├── admin/prode/          ← panel admin
│   └── auth/                 ← login + register + signout
├── components/
│   ├── ProdeBoard.tsx        ← UI compartida entre demo y real
│   ├── MatchCard.tsx
│   ├── Navbar.tsx
│   └── EckLogo.tsx
├── lib/
│   ├── supabase/             ← clients server + browser
│   ├── prode-utils.ts        ← calcPoints, PHASES, FLAGS
│   ├── mock-data.ts          ← partidos seed para /demo
│   └── env.ts                ← detecta si Supabase está configurado
└── types/database.ts         ← tipos Profile, ProdeMatch, ProdePrediction
```
