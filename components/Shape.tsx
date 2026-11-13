import type { Verdict } from "@/lib/types";

export const VERDICT_COLOR: Record<Verdict, string> = {
  pass: "var(--go)",
  rework: "var(--hold)",
  stop: "var(--halt)",
};

// Pass = circle, rework = triangle, stop = square. Color is never the only signal.
export function Shape({ verdict, size = 24 }: { verdict: Verdict; size?: number }) {
  const fill = VERDICT_COLOR[verdict];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {verdict === "pass" && <circle cx="12" cy="12" r="10" fill={fill} />}
      {verdict === "rework" && <polygon points="12,2 22,21 2,21" fill={fill} />}
      {verdict === "stop" && <rect x="2" y="2" width="20" height="20" fill={fill} />}
    </svg>
  );
}
