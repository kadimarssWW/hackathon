# Juurdepääsupiirangu määramise prototüüp

See on prototüüp dokumendi juurdepääsupiirangu tuletamiseks metaandmetest.
Fookus on suund D: automatiseeritud ettepanek, selge "miks" ja töötaja kinnitamine.

## Mis on sees

- `pages/index.tsx` — kaksveeruline vorm + automaatne piirangupaneel
- `pages/api/juurdepääsupiirangu/tuleta.ts` — API endpoint metaandmete hindamiseks ja salvestamiseks
- `lib/meta.ts` — metaandmetest tuletamise loogika
- `lib/engine.ts` — AvTS § 35 alusel hindav otsustusmootor
- `lib/supabaseClient.ts` — Supabase'i klient browseri ja serveri jaoks
- `components/AccessRestrictionPanel.tsx` — visuaalne vaatemoodul
- `styles/globals.css` — disainitokenid ja vormistiilid
- `.env.local.example` — Supabase'i keskkonnamuutujate mall

## Supabase'i seadistus

1. Loo Supabase'i projekt.
2. Lisa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ja `SUPABASE_SERVICE_ROLE_KEY`.
3. Käivita `cp .env.local.example .env.local` ja asenda väärtused.
4. Loo Supabase'is järgmised tabelid:

### Tabel `documents`
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `series` (text)
- `document_number` (text)
- `contract_title` (text)
- `description` (text)
- `partner_type` (text)
- `contact_email` (text)
- `our_contact` (text)
- `validity` (text)
- `signed_file` (boolean)
- `confirm_business_secret` (boolean)
- `created_at` (timestamp with time zone, default `now()`)

### Tabel `access_restrictions`
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `document_id` (uuid, foreign key -> documents.id)
- `piirang` (text)
- `partial` (boolean)
- `grounds` (text[])
- `primary` (text)
- `kehtivusaeg` (text)
- `kehtivus_cite` (text)
- `kehtivus_note` (text)
- `pohjendus` (text)
- `kindlus` (text)
- `marking` (text)
- `created_at` (timestamp with time zone, default `now()`)

## Käivitamine

1. `npm install`
2. `npm run dev`
3. Ava `http://localhost:3000`

## Deploy Vercelile

1. Loo Vercel projekt ja ühenda oma repo.
2. Lisa samad keskkonnamuutujad (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) Vercel Dashboardis.
3. Vercel käivitab ehituse automaatselt.
