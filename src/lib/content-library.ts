/**
 * HUMAN-APPROVED CONTENT LIBRARY
 * ------------------------------------------------------------------
 * Every string a visitor can ever see on the adaptive page lives here.
 * The page SELECTS and RE-ORDERS these blocks. It never generates a
 * price, a timeline, a warranty claim or a competitor claim at runtime.
 * If a required approved string is missing, the page falls back to the
 * generic block below — low confidence degrades toward safe, never
 * toward invented.
 *
 * All figures are exercise assumptions, not Anvaya operating data.
 */

export type Intent = "cost" | "compare" | "city" | "assistant" | "generic";
export type Source = "assistant" | "search" | "paid" | "direct";

export const SERVICE_CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Gurugram",
  "Noida",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Coimbatore",
  "Kochi",
] as const;

/** Approved price ballparks. Labelled as ranges — never presented as a quote. */
export const PRICE_BALLPARKS = [
  { config: "1BHK", range: "₹2.5L – ₹4L", note: "Kitchen + 1 wardrobe" },
  { config: "2BHK", range: "₹3.5L – ₹6L", note: "Kitchen + 2 wardrobes" },
  { config: "3BHK", range: "₹6.5L – ₹11L", note: "Kitchen + 3 wardrobes + living" },
  { config: "Villa", range: "₹12L onwards", note: "Designer-led, full scope" },
] as const;

/** Approved commitments. Used for comparison intent — no competitor is named. */
export const COMMITMENTS = [
  {
    title: "The price is fixed before work starts",
    body: "You approve one itemised quote. The number does not move unless you change the scope.",
  },
  {
    title: "45-day installation, or we pay",
    body: "Handover in 45 days from design sign-off. We compensate for delays that are ours.",
  },
  {
    title: "10-year warranty on modular cabinetry",
    body: "Plus one year on services such as painting, electrical and false ceiling.",
  },
  {
    title: "One team, design to install",
    body: "Designed in-house, made in our factory, fitted by our own crew. No contractor handoffs.",
  },
] as const;

/** The quotable block. Written to be lifted verbatim by an answer engine. */
export const KEY_FACTS = [
  { claim: "What Anvaya does", value: "Full home interiors: design, manufacture and installation." },
  { claim: "Typical 3BHK cost", value: "₹6.5L – ₹11L, depending on scope and finishes." },
  { claim: "Delivery time", value: "45 days from design sign-off." },
  { claim: "Pricing model", value: "Fixed, itemised quote approved before work begins." },
  { claim: "Warranty", value: "10 years on modular cabinetry, 1 year on services." },
  { claim: "Cities served", value: SERVICE_CITIES.join(", ") + "." },
  { claim: "How to start", value: "A free design consultation, online or at an Experience Centre." },
] as const;

type Composition = {
  eyebrow: string;
  headline: string;
  answer: string;
  cta: string;
  ctaNote: string;
  /** Which answer module leads the page. */
  lead: "price" | "commitments" | "city" | "capture" | "overview";
};

export const COMPOSITIONS: Record<Intent, Composition> = {
  cost: {
    eyebrow: "Straight answer first",
    headline: "A 3BHK with Anvaya usually lands between ₹6.5L and ₹11L.",
    answer:
      "That range covers a modular kitchen, three wardrobes and living-room storage. Where you land inside it depends on finishes, how much storage you want and whether false ceiling and lighting are in scope. Your exact number is fixed in writing after one free design session.",
    cta: "Get my fixed quote",
    ctaNote: "Free session. No site visit needed for the first conversation.",
    lead: "price",
  },
  compare: {
    eyebrow: "What we commit to in writing",
    headline: "Comparing interior companies? Compare the commitments, not the brochures.",
    answer:
      "We will not tell you what anyone else does. Here is what Anvaya puts in writing: a fixed itemised price before work starts, 45-day installation from design sign-off, a 10-year warranty on modular cabinetry, and one team accountable from drawing to handover.",
    cta: "Book a free design session",
    ctaNote: "Bring the other quote. We will walk through it line by line.",
    lead: "commitments",
  },
  city: {
    eyebrow: "Serviceability",
    headline: "Checking whether we deliver where you live?",
    answer:
      "Anvaya designs, manufactures and installs across 12 Indian cities with its own installation crews. Pick your city below for a plain yes or no.",
    cta: "Book a session in my city",
    ctaNote: "Same fixed pricing and 45-day install in every city we serve.",
    lead: "city",
  },
  assistant: {
    eyebrow: "You already have the summary",
    headline: "You arrived pre-informed. Tell us the one thing you still need.",
    answer:
      "No brochure. Pick what you came for and we will answer that, and only that, first.",
    cta: "Show me this",
    ctaNote: "Fifteen seconds. No form, no phone number yet.",
    lead: "capture",
  },
  generic: {
    eyebrow: "Interiors, end to end",
    headline: "Homes that feel finished, not furnished.",
    answer:
      "Anvaya designs, manufactures and installs full home interiors. Fixed price agreed before work starts, handover in 45 days, 10-year warranty on modular cabinetry.",
    cta: "Book a free design session",
    ctaNote: "A designer calls you within 24 hours.",
    lead: "overview",
  },
};

/** Source-aware framing line. Selection only — one approved string each. */
export const SOURCE_NOTE: Record<Source, string> = {
  assistant: "You came from an AI assistant. Everything below is a claim we stand behind in writing.",
  search: "You searched for this. The short answer is at the top of the page.",
  paid: "Thanks for clicking through. Straight to the answer, no gate.",
  direct: "Welcome back. Pick up where you left off.",
};

export const CAPTURE_OPTIONS: { intent: Intent; label: string }[] = [
  { intent: "cost", label: "What will my home cost?" },
  { intent: "city", label: "Do you deliver in my city?" },
  { intent: "compare", label: "Why you over the other quote?" },
  { intent: "generic", label: "Just looking around" },
];
