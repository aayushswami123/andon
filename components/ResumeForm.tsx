"use client";

import { useState } from "react";
import { WORDS } from "@/lib/labels";

const BUTTON =
  "h-12 rounded-[2px] border border-paper px-5 font-cond text-[20px] font-semibold text-paper hover:bg-paper/10";

// The note is asked for inline, right where the button was. No modal.
export function ResumeForm({ onResume }: { onResume: (note: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button type="button" className={BUTTON} onClick={() => setOpen(true)}>
        {WORDS.resume}
      </button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onResume(note.trim());
      setOpen(false);
      setNote("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-3">
      <input
        autoFocus
        aria-label={WORDS.note}
        placeholder={WORDS.note}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="h-12 w-[360px] rounded-[2px] border border-paper bg-steel-900 px-3 text-[16px] text-paper placeholder:text-paper-dim"
      />
      <button type="submit" disabled={busy} className={BUTTON}>
        {WORDS.resume}
      </button>
    </form>
  );
}
