// Scores at or above `stop` stop the line; between `rework` and `stop` ask for rework.
export const T = { rework: 0.35, stop: 0.75, minConfidence: 0.6 };

// Board: how often it polls and how many lamp tiles stay on the line.
export const BOARD = { pollMs: 1000, keepTiles: 24 };

// Decision model. Price is from docs.typesafe.ai/models: $0.042 per million input tokens, output free.
// maxDiffChars keeps the state well under the 32k-token per-question limit and keeps calls fast.
export const JEV = {
  timeoutMs: 3000,
  model: "jev-latest",
  openRouterModel: "typesafe/jev-1.13",
  openRouterUrl: "https://openrouter.ai/api/alpha/decisions",
  usdPerInputToken: 0.042 / 1_000_000,
  charsPerToken: 4,
  maxDiffChars: 60_000,
};
