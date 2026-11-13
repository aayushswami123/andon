create table if not exists events (
  id          bigserial,
  ts          timestamptz not null default now(),
  run_id      text not null,
  files       text[] not null,
  diff        text not null,
  facts       jsonb not null,
  answers     jsonb not null,
  verdict     text not null,
  reason      text not null,
  fired_by    text,
  escalated   boolean not null default false,
  latency_ms  int not null,
  cost_usd    numeric not null
);
select create_hypertable('events', 'ts', if_not_exists => true);

create table if not exists line (
  id       int primary key default 1,
  stopped  boolean not null default false,
  reason   text,
  event_id bigint,
  since    timestamptz
);
insert into line (id) values (1) on conflict (id) do nothing;
