-- Migrations will appear here as you chat with AI

create table phone_numbers (
  id bigint primary key generated always as identity,
  number text not null,
  name text not null
);

create table calls (
  id bigint primary key generated always as identity,
  phone_number_id bigint not null references phone_numbers (id),
  date date not null,
  "time" time not null,
  duration interval not null
);

create table transcripts (
  id bigint primary key generated always as identity,
  call_id bigint not null references calls (id),
  text text not null,
  is_agent boolean not null
);