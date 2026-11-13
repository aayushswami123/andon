import postgres from "postgres";
import type { Facts } from "./facts";
import type { Answers, Verdict } from "./types";

export type EventRow = {
  id: number;
  ts: string;
  run_id: string;
  files: string[];
  verdict: Verdict;
  reason: string;
  fired_by: string | null;
  escalated: boolean;
  latency_ms: number;
  cost_usd: number;
  facts: Facts;
  answers: Answers;
};

export type LineRow = {
  stopped: boolean;
  reason: string | null;
  event_id: number | null;
  since: string | null;
};

export type Stats = {
  checks: number;
  pass: number;
  rework: number;
  stop: number;
  medianLatencyMs: number;
  totalCostUsd: number;
};

type NewEvent = {
  runId: string;
  files: string[];
  diff: string;
  facts: Facts;
  answers: Answers;
  verdict: Verdict;
  reason: string;
  firedBy: string | null;
  latencyMs: number;
  costUsd: number;
};

let client: ReturnType<typeof postgres> | null = null;

// Lazy so importing this module never fails; only the first query needs DATABASE_URL.
function sql() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = postgres(url, { max: 5 });
  }
  return client;
}

// Diff is left out: the list is polled every second and diffs can be large.
const EVENT_COLUMNS = `id::int as id, ts, run_id, files, verdict, reason, fired_by, escalated, latency_ms,
  cost_usd::float as cost_usd, facts, answers`;

export async function insertEvent(e: NewEvent): Promise<number> {
  const rows = await sql()<{ id: number }[]>`
    insert into events (run_id, files, diff, facts, answers, verdict, reason, fired_by, latency_ms, cost_usd)
    values (${e.runId}, ${e.files}, ${e.diff}, ${sql().json(e.facts)}, ${sql().json(e.answers)},
            ${e.verdict}, ${e.reason}, ${e.firedBy}, ${e.latencyMs}, ${e.costUsd})
    returning id`;
  return Number(rows[0]!.id);
}

export async function eventsAfter(afterId: number, limit: number): Promise<EventRow[]> {
  return sql()<EventRow[]>`
    select ${sql().unsafe(EVENT_COLUMNS)} from events
    where id > ${afterId} order by id asc limit ${limit}`;
}

// Fetched on demand for the selected tile only, since diffs are left out of the polled list.
export async function eventDiff(id: number): Promise<string | null> {
  const rows = await sql()<{ diff: string }[]>`select diff from events where id = ${id}`;
  return rows[0]?.diff ?? null;
}

export async function getLine(): Promise<LineRow> {
  const rows = await sql()<LineRow[]>`select stopped, reason, event_id::int as event_id, since from line where id = 1`;
  return rows[0] ?? { stopped: false, reason: null, event_id: null, since: null };
}

export async function stopLine(reason: string, eventId: number): Promise<void> {
  await sql()`update line set stopped = true, reason = ${reason}, event_id = ${eventId}, since = now() where id = 1`;
}

export async function resumeLine(): Promise<void> {
  await sql()`update line set stopped = false, reason = null, event_id = null, since = null where id = 1`;
}

export async function getStats(): Promise<Stats> {
  const rows = await sql()<Stats[]>`
    select count(*)::int as checks,
           count(*) filter (where verdict = 'pass')::int as pass,
           count(*) filter (where verdict = 'rework')::int as rework,
           count(*) filter (where verdict = 'stop')::int as stop,
           coalesce(percentile_cont(0.5) within group (order by latency_ms), 0)::float as "medianLatencyMs",
           coalesce(sum(cost_usd), 0)::float as "totalCostUsd"
    from events`;
  return rows[0]!;
}
