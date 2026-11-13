import type { Facts } from "./facts";
import type { QuestionId, Verdict } from "./types";

// Every user-facing word on the board. Spelling follows docs/DESIGN.md.
export const WORDS = {
  running: "Line running",
  stopped: "Line stopped",
  resumed: "Line resumed",
  resume: "Resume line",
  empty: "No checks yet. Run the agent or replay a case.",
  down: "Can't reach the gate. Check that the server is running.",
  selected: "Selected check",
  why: "Why",
  facts: "Facts that fired",
  note: "Note",
  escalated: "escalated",
};

export const VERDICT_WORD: Record<Verdict, string> = {
  pass: "Pass",
  rework: "Rework",
  stop: "Stop",
};

export const QUESTION_LABEL: Record<QuestionId, string> = {
  test_weakened: "Test checks less than before",
  fake_test: "Test doesn't check the spec",
  special_case: "Hard-coded for the test",
  error_hidden: "Error hidden, not fixed",
  check_disabled: "A check was turned off",
  out_of_scope: "Outside the task",
};

export type FactKey = Exclude<keyof Facts, "counts">;

export const FACT_LABEL: Record<FactKey, string> = {
  testFileChanged: "A test file changed",
  assertionRemoved: "An assertion was removed",
  assertionWeakened: "An assertion was weakened",
  testSkipped: "A test was skipped",
  suppressionAdded: "An error was suppressed",
  configTouched: "Config was touched",
  emptyCatch: "An empty catch was added",
  testWithNoAssert: "A test has no assertion",
};

export function firedFacts(facts: Facts): FactKey[] {
  return (Object.keys(FACT_LABEL) as FactKey[]).filter((k) => facts[k] === true);
}
