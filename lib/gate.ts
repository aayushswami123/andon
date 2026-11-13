import { getLine, insertEvent, stopLine } from "./db";
import { extractFacts } from "./facts";
import { JevError, judge, questionsFor } from "./jev";
import { decide } from "./rules";
import type { Answers, Decision } from "./types";

export type GateInput = { runId: string; spec: string; diff: string; files: string[] };

export type GateResult = Decision & { eventId: number | null };

const LINE_STOPPED_REASON = "The line is stopped. A human must resume it.";
const CHECK_FAILED_REASON = "Check could not run";

export async function runGate(input: GateInput): Promise<GateResult> {
  const line = await getLine();
  if (line.stopped) {
    return { verdict: "stop", reason: line.reason ?? LINE_STOPPED_REASON, firedBy: "line", eventId: line.event_id };
  }

  const facts = extractFacts(input.diff);
  const state = { spec: input.spec, facts, diff: input.diff };

  let answers: Answers = {};
  let latencyMs = 0;
  let costUsd = 0;
  let decision: Decision;
  try {
    const judgment = await judge(state, questionsFor(facts));
    ({ answers, latencyMs, costUsd } = judgment);
    decision = decide(facts, answers);
  } catch (err) {
    if (!(err instanceof JevError)) throw err;
    // Sentry wiring comes in PLAN task 10; until then this is the only trace of a failed check.
    console.error("[andon] judge failed", err);
    decision = { verdict: "rework", reason: CHECK_FAILED_REASON, firedBy: "jev_error" };
  }

  const eventId = await insertEvent({
    runId: input.runId,
    files: input.files,
    diff: input.diff,
    facts,
    answers,
    verdict: decision.verdict,
    reason: decision.reason,
    firedBy: decision.firedBy,
    latencyMs,
    costUsd,
  });
  if (decision.verdict === "stop") await stopLine(decision.reason, eventId);

  return { ...decision, eventId };
}
