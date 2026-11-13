"use client";

import { Diff } from "@/components/Diff";
import { Line } from "@/components/Line";
import { StatusBar } from "@/components/StatusBar";
import { Why } from "@/components/Why";
import { useBoard } from "@/components/useBoard";
import { WORDS } from "@/lib/labels";

export default function Board() {
  const b = useBoard();
  const stopped = b.line?.stopped ?? false;
  const middle = stopped ? WORDS.stopped : b.resumed ? WORDS.resumed : WORDS.running;
  const note = stopped ? (b.line?.reason ?? null) : b.apiDown ? WORDS.down : null;
  const selected = b.events.find((e) => e.id === b.selectedId) ?? null;

  return (
    <main className="grid h-screen min-w-[1440px] grid-rows-[112px_112px_1fr] bg-steel-900 text-paper">
      <StatusBar stopped={stopped} middle={middle} note={note} stats={b.stats} onResume={b.resume} />
      <Line
        events={b.events}
        selectedId={b.selectedId}
        stoppedId={stopped ? (b.line?.event_id ?? null) : null}
        message={b.apiDown && b.events.length === 0 ? WORDS.down : null}
        onSelect={b.setSelectedId}
      />
      <div className="grid min-h-0 grid-cols-2 border-t border-steel-600">
        <Diff event={selected} diff={selected ? b.diff : null} />
        <Why event={selected} />
      </div>
    </main>
  );
}
