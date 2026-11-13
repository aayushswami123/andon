"use client";

import { T } from "@/lib/config";
import type { EventRow } from "@/lib/db";
import { FACT_LABEL, QUESTION_LABEL, WORDS, firedFacts } from "@/lib/labels";
import { QUESTION_IDS } from "@/lib/types";

function barColor(p: number) {
  if (p >= T.stop) return "var(--halt)";
  if (p >= T.rework) return "var(--hold)";
  return "var(--go)";
}

function ScoreBar({ p }: { p: number }) {
  return (
    <div className="relative h-3 flex-1 bg-steel-600" aria-hidden="true">
      <div className="h-full" style={{ width: `${p * 100}%`, background: barColor(p) }} />
      {[T.rework, T.stop].map((t) => (
        <div key={t} className="absolute -top-1 h-5 w-px bg-paper-dim" style={{ left: `${t * 100}%` }} />
      ))}
    </div>
  );
}

// Right half of the detail area: the reason, each question's score, and the facts that fired.
export function Why({ event }: { event: EventRow | null }) {
  const asked = event ? QUESTION_IDS.filter((id) => event.answers[id]) : [];
  const facts = event ? firedFacts(event.facts) : [];
  return (
    <section className="flex min-h-0 flex-col overflow-auto bg-steel-800">
      <div className="border-b border-steel-600 px-8 py-4">
        <h2 className="text-[16px] text-paper-dim">{WORDS.why}</h2>
      </div>
      {event && (
        <div className="flex flex-col gap-8 px-8 py-6">
          <p className="text-[20px]">{event.reason}</p>
          <ul className="flex flex-col gap-4">
            {asked.map((id) => {
              const a = event.answers[id]!;
              return (
                <li key={id} className="grid grid-cols-[280px_1fr_64px] items-center gap-4">
                  <span className="text-[16px]">{QUESTION_LABEL[id]}</span>
                  <ScoreBar p={a.probability} />
                  <span className="text-right font-cond text-[20px] font-semibold">{a.probability.toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
          {facts.length > 0 && (
            <div>
              <h3 className="mb-2 text-[16px] text-paper-dim">{WORDS.facts}</h3>
              <ul className="flex flex-col gap-1">
                {facts.map((k) => (
                  <li key={k} className="text-[16px]">
                    {FACT_LABEL[k]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
