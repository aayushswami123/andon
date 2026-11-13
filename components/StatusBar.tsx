"use client";

import type { Stats } from "@/lib/db";
import { ResumeForm } from "./ResumeForm";

type Props = {
  stopped: boolean;
  middle: string;
  note: string | null;
  stats: Stats | null;
  onResume: (note: string) => Promise<void>;
};

function fmtStats(s: Stats) {
  return [`${s.checks} checks`, `${(s.medianLatencyMs / 1000).toFixed(2)}s`, `$${s.totalCostUsd.toFixed(2)}`];
}

export function StatusBar({ stopped, middle, note, stats, onResume }: Props) {
  return (
    <header className="relative grid grid-cols-[240px_1fr_auto] items-center border-b border-steel-600 bg-steel-800 px-8">
      <div className="halt-fill absolute inset-0 bg-halt" data-on={stopped} aria-hidden="true" />
      <div className="relative font-cond text-[28px] font-bold">Andon</div>
      <div className="relative" role="status" aria-live="polite">
        <div className={stopped ? "font-cond text-[40px] font-bold leading-none" : "font-cond text-[28px] font-semibold"}>
          {middle}
        </div>
        {note && <div className={`mt-1 text-[20px] ${stopped ? "text-paper" : "text-paper-dim"}`}>{note}</div>}
      </div>
      <div className="relative flex items-center gap-8">
        {stopped ? (
          <ResumeForm onResume={onResume} />
        ) : (
          stats &&
          fmtStats(stats).map((s) => (
            <span key={s} className="font-cond text-[28px] font-semibold">
              {s}
            </span>
          ))
        )}
      </div>
    </header>
  );
}
