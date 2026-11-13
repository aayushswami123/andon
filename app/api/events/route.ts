import { NextResponse } from "next/server";
import { eventsAfter } from "@/lib/db";

const PAGE = 200;

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("after");
  const after = Number(raw ?? 0);
  if (!Number.isFinite(after) || after < 0) {
    return NextResponse.json({ error: "after must be a non-negative number" }, { status: 400 });
  }
  return NextResponse.json({ events: await eventsAfter(after, PAGE) });
}
