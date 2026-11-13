"use client";

import type { EventRow } from "@/lib/db";
import { VERDICT_WORD, WORDS } from "@/lib/labels";
import { Shape } from "./Shape";

function lineClass(line: string) {
  if (line.startsWith("+++") || line.startsWith("---")) return "text-paper";
  if (line.startsWith("+")) return "text-go";
  if (line.startsWith("-")) return "text-halt";
  if (line.startsWith("@@") || line.startsWith("diff ")) return "text-paper-dim";
  return "text-paper-dim";
}

// Left half of the detail area. The diff scrolls inside; the page never does.
export function Diff({ event, diff }: { event: EventRow | null; diff: string | null }) {
  return (
    <section className="flex min-h-0 flex-col border-r border-steel-600 bg-steel-800">
      <div className="flex items-center gap-4 border-b border-steel-600 px-8 py-4">
        <h2 className="text-[16px] text-paper-dim">{WORDS.selected}</h2>
        {event && (
          <>
            <Shape verdict={event.verdict} size={20} />
            <span className="font-cond text-[20px] font-semibold">{VERDICT_WORD[event.verdict]}</span>
            <span className="truncate text-[16px] text-paper-dim">{event.files.join(", ")}</span>
          </>
        )}
      </div>
      <pre className="min-h-0 flex-1 overflow-auto px-8 py-4 font-mono text-[14px] leading-5">
        {diff === null
          ? null
          : diff.split("\n").map((line, i) => (
              <div key={i} className={lineClass(line)}>
                {line || " "}
              </div>
            ))}
      </pre>
    </section>
  );
}
