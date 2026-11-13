"use client";

import type { EventRow } from "@/lib/db";
import { VERDICT_WORD, WORDS } from "@/lib/labels";
import { Shape, VERDICT_COLOR } from "./Shape";

type Props = {
  events: EventRow[];
  selectedId: number | null;
  stoppedId: number | null;
  message: string | null;
  onSelect: (id: number) => void;
};

// One lamp per check. Newest on the right, lit; the rest are idle lamps.
export function Line({ events, selectedId, stoppedId, message, onSelect }: Props) {
  const newest = events[events.length - 1];
  return (
    <section aria-label="The line" className="flex items-center gap-3 overflow-hidden px-8">
      {events.length === 0 && <p className="text-[20px] text-paper-dim">{message ?? WORDS.empty}</p>}
      {events.map((e) => {
        const isNewest = e.id === newest?.id;
        const dim = stoppedId !== null && e.id !== stoppedId;
        const selected = e.id === selectedId;
        return (
          <button
            key={e.id}
            type="button"
            aria-label={`${VERDICT_WORD[e.verdict]}, check ${e.id}`}
            aria-pressed={selected}
            onClick={() => onSelect(e.id)}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] border bg-steel-800 ${
              selected ? "border-paper" : "border-steel-600"
            } ${isNewest ? "tile-in" : ""}`}
            style={{
              opacity: dim ? 0.4 : 1,
              boxShadow: isNewest ? `0 0 14px ${VERDICT_COLOR[e.verdict]}` : undefined,
            }}
          >
            <Shape verdict={e.verdict} size={28} />
          </button>
        );
      })}
      {events.length > 0 && message && <p className="ml-6 text-[16px] text-paper-dim">{message}</p>}
    </section>
  );
}
