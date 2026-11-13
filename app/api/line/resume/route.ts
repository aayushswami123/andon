import { NextResponse } from "next/server";
import { getLine, resumeLine } from "@/lib/db";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { note?: unknown };
  const note = typeof body.note === "string" ? body.note : "";
  // The schema has no place for the note yet; log it so the resume is at least traceable.
  console.info("[andon] line resumed", note ? `note: ${note}` : "(no note)");
  await resumeLine();
  return NextResponse.json(await getLine());
}
