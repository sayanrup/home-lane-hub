import type { Intent, Source } from "./content-library";
import { SERVICE_CITIES } from "./content-library";

export type Signals = {
  intent: Intent;
  source: Source;
  city: string | null;
  citySupported: boolean | null;
  lowBandwidth: boolean;
  query: string | null;
};

const COST_WORDS = ["cost", "price", "pricing", "budget", "quote", "lakh", "cheap", "rate", "bhk"];
const COMPARE_WORDS = ["vs", "versus", "compare", "comparison", "better", "alternative", "alternatives", "review", "reviews"];
const CITY_WORDS = ["near me", "city", "cities", "deliver", "delivery", "available", "serviceable", "branch", "location"];

const hasWord = (q: string, words: string[]) =>
  words.some((w) => new RegExp(`(^|\\s)${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(q));

/** Rule-based intent classification. Unknown phrasing degrades to generic. */
export function classifyIntent(query: string | null, source: Source, explicit?: string): Intent {
  const valid: Intent[] = ["cost", "compare", "city", "assistant", "generic"];
  if (explicit && valid.includes(explicit as Intent)) return explicit as Intent;

  const q = (query ?? "").toLowerCase().trim();
  if (q) {
    if (hasWord(q, COMPARE_WORDS)) return "compare";
    if (hasWord(q, COST_WORDS) || /\d\s*bhk/.test(q)) return "cost";
    if (hasWord(q, CITY_WORDS)) return "city";
  }
  if (source === "assistant") return "assistant";
  return "generic";
}

export function normaliseCity(city: string | null): { city: string | null; supported: boolean | null } {
  if (!city) return { city: null, supported: null };
  const match = SERVICE_CITIES.find((c) => c.toLowerCase() === city.toLowerCase().trim());
  if (match) return { city: match, supported: true };
  const pretty = city.trim().replace(/\b\w/g, (m) => m.toUpperCase());
  return { city: pretty, supported: false };
}

export function detectSource(src: string | undefined, referrer: string): Source {
  const valid: Source[] = ["assistant", "search", "paid", "direct"];
  if (src && valid.includes(src as Source)) return src as Source;
  const r = referrer.toLowerCase();
  if (!r) return "direct";
  if (/chatgpt|perplexity|gemini|claude|copilot/.test(r)) return "assistant";
  if (/google|bing|duckduckgo|yahoo/.test(r)) return "search";
  return "direct";
}

/** Roughly how fast their connection is — used to drop heavy imagery. */
export function detectLowBandwidth(forced?: string): boolean {
  if (forced === "slow") return true;
  if (forced === "fast") return false;
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  if (!c) return false;
  return Boolean(c.saveData) || ["slow-2g", "2g", "3g"].includes(c.effectiveType ?? "");
}
