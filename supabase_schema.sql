-- Supabase schema for Juurdepääsupiirangu määramise prototüüp

create extension if not exists "pgcrypto";

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  series text,
  document_number text,
  contract_title text,
  description text,
  partner_type text,
  contact_email text,
  our_contact text,
  validity text,
  signed_file boolean default false,
  confirm_business_secret boolean,
  created_at timestamp with time zone default now()
);

create table if not exists access_restrictions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  piirang text,
  partial boolean default false,
  grounds text[],
  primary text,
  kehtivusaeg text,
  kehtivus_cite text,
  kehtivus_note text,
  pohjendus text,
  kindlus text,
  marking text,
  created_at timestamp with time zone default now()
);
