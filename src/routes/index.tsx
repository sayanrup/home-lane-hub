import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  Search,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  CAPTURE_OPTIONS,
  COMMITMENTS,
  COMPOSITIONS,
  KEY_FACTS,
  PRICE_BALLPARKS,
  SERVICE_CITIES,
  type Intent,
  type Source,
} from "@/lib/content-library";
import { classifyIntent, detectLowBandwidth, detectSource, normaliseCity } from "@/lib/personalize";

import heroLiving from "@/assets/hero-living.jpg";
import kitchenImg from "@/assets/kitchen.jpg";
import bedroomImg from "@/assets/bedroom.jpg";
import studyImg from "@/assets/study.jpg";
import wardrobeImg from "@/assets/wardrobe.jpg";

type Search = Partial<Record<"q" | "intent" | "src" | "city" | "speed", string>>;

const SEARCH_KEYS = ["q", "intent", "src", "city", "speed"] as const;

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    for (const k of SEARCH_KEYS) {
      const v = s[k];
      if (typeof v === "string" && v) out[k] = v;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "HomeLane — Full Home Interiors, Fixed Price, 45-Day Install" },
      {
        name: "description",
        content:
          "A 3BHK with HomeLane costs ₹6.5L–₹11L. Fixed itemised price before work starts, 45-day installation, 10-year warranty on modular cabinetry, 12 Indian cities.",
      },
      { property: "og:title", content: "HomeLane — Full Home Interiors, Fixed Price, 45-Day Install" },
      {
        property: "og:description",
        content:
          "Design, manufacture and installation by one team. Fixed price, 45-day handover, 10-year warranty.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const spaces = [
  { title: "Modular kitchens", copy: "Soft-close hardware, moisture-proof cores, layouts planned around how you cook.", img: kitchenImg },
  { title: "Bedrooms", copy: "Warm palettes, storage-first beds, headboards made to your ceiling height.", img: bedroomImg },
  { title: "Wardrobes", copy: "Sliding, hinged or walk-in — fitted wall to wall with zero dead corners.", img: wardrobeImg },
  { title: "Studies & storage", copy: "Work nooks, crockery units and TV walls that borrow no floor space.", img: studyImg },
];

const processSteps = [
  { step: "01", title: "Meet a designer", copy: "Share your floor plan, budget and taste. Free, no obligation." },
  { step: "02", title: "See it in 3D", copy: "Walk through your home live and change anything." },
  { step: "03", title: "Lock the price", copy: "One itemised quote. The number does not move later." },
  { step: "04", title: "Move in", copy: "Factory-made, site-installed, handed over in 45 days." },
];

const stories = [
  { quote: "The 3D session sold it for us. What we saw on screen is what got installed.", name: "Ananya & Rohit", home: "3BHK, Whitefield, Bengaluru" },
  { quote: "Handover was four days early. The kitchen storage plan changed how we use the house.", name: "Meera Nair", home: "2BHK, Powai, Mumbai" },
  { quote: "Fixed pricing meant no arguments at the end. That is rare in this business.", name: "Vikram Sethi", home: "Villa, Gurugram" },
];

const faqs = [
  { q: "What does a 3BHK cost?", a: "Between ₹6.5L and ₹11L, depending on scope and finishes. Your exact number is fixed in an itemised quote after one free design session." },
  { q: "How long does a full home take?", a: "45 days of installation from the day the design is signed off. Design itself usually takes about two weeks." },
  { q: "Is the quote really fixed?", a: "Yes. Once you approve the itemised quote, the price stays put unless you change the scope." },
  { q: "Which cities do you serve?", a: `HomeLane delivers in ${SERVICE_CITIES.join(", ")}.` },
  { q: "What does the warranty cover?", a: "10 years on modular cabinetry and 1 year on services such as painting, electrical and false ceiling." },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "HomeLane",
        description: "HomeLane designs, manufactures and installs full home interiors in India.",
        areaServed: SERVICE_CITIES.map((c) => ({ "@type": "City", name: c })),
      },
      {
        "@type": "Service",
        name: "Full home interior design and installation",
        provider: { "@type": "Organization", name: "HomeLane" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: "250000",
          highPrice: "1200000",
          description: "1BHK ₹2.5L–₹4L, 2BHK ₹3.5L–₹6L, 3BHK ₹6.5L–₹11L, villas ₹12L onwards.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

function Index() {
  const search = Route.useSearch();
  const [source, setSource] = useState<Source>("direct");
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [captured, setCaptured] = useState<Intent | null>(null);
  const [cityPick, setCityPick] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", city: "", message: "" });

  useEffect(() => {
    setSource(detectSource(search.src, typeof document === "undefined" ? "" : document.referrer));
    setLowBandwidth(detectLowBandwidth(search.speed));
  }, [search.src, search.speed]);

  const intent: Intent = useMemo(
    () => captured ?? classifyIntent(search.q ?? null, source, search.intent),
    [captured, search.q, search.intent, source],
  );

  const c = COMPOSITIONS[intent] ?? COMPOSITIONS.generic;
  const geo = normaliseCity(cityPick ?? search.city ?? null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please add your name and phone number.");
      return;
    }
    toast.success("Thanks! A HomeLane designer will call you within 24 hours.");
    setForm({ name: "", phone: "", city: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-8">
          <a href="#top" className="truncate font-display text-lg font-bold tracking-tight">
            Home<span className="text-primary">Lane</span>
          </a>
          <Button asChild size="sm" className="shrink-0 rounded-none px-4 text-xs sm:text-sm">
            <a href="#consult">Free design session</a>
          </Button>
        </div>
      </header>

      {/* Adaptive answer block */}
      <section id="top" className="relative border-b border-border">
        {!lowBandwidth && (
          <>
            <img
              src={heroLiving}
              alt="Warm modern living room designed by HomeLane"
              width={1920}
              height={1200}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/80 to-ink/95" />
          </>
        )}
        <div className={`relative mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-20 ${lowBandwidth ? "bg-ink" : ""}`}>
          <div className="max-w-2xl text-ink-foreground">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-accent">
              <Sparkles className="h-3.5 w-3.5" /> {c.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-[28px] leading-[1.15] font-semibold sm:text-4xl lg:text-5xl">
              {c.headline}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ink-foreground/85 sm:text-base">{c.answer}</p>
            <p className="mt-3 text-xs text-ink-foreground/60">{SOURCE_NOTE[source]}</p>

            {/* Lead module — selected, never generated */}
            <div className="mt-7">
              {c.lead === "price" && <PriceModule />}
              {c.lead === "commitments" && <CommitmentsModule />}
              {c.lead === "city" && (
                <CityModule selected={geo.city} supported={geo.supported} onPick={setCityPick} />
              )}
              {c.lead === "capture" && <CaptureModule onPick={setCaptured} />}
              {c.lead === "overview" && <OverviewModule />}
            </div>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="w-full rounded-none sm:w-auto sm:px-7">
                <a href="#consult">
                  {c.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <p className="text-xs text-ink-foreground/60 sm:ml-3">{c.ctaNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts — the quotable layer */}
      <section id="key-facts" className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">Key facts about HomeLane</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Short, checkable statements. Written to be quoted accurately.
          </p>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {KEY_FACTS.map((f) => (
              <div key={f.claim} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:gap-6">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.claim}</dt>
                <dd className="text-sm">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-8 lg:grid-cols-4 lg:px-8">
          {[
            { icon: IndianRupee, label: "Fixed pricing", sub: "Quoted once, honoured always" },
            { icon: Clock3, label: "45-day install", sub: "Or we pay you for delays" },
            { icon: ShieldCheck, label: "10-year warranty", sub: "On all modular cabinetry" },
            { icon: Star, label: "20,000+ homes", sub: "Delivered across 12 cities" },
          ].map((item) => (
            <div key={item.label} className="flex min-w-0 items-start gap-2.5">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spaces */}
      <section id="spaces" className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Every room, measured for your walls</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Nothing here is off the shelf. Each unit is drawn to your floor plan, built in our factory and fitted by our own crew.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {spaces.map((s) => (
            <article key={s.title} className="overflow-hidden border border-border bg-card">
              {!lowBandwidth && (
                <img
                  src={s.img}
                  alt={s.title}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Four steps from floor plan to housewarming</h2>
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((p) => (
              <div key={p.step} className="border-t border-ink-foreground/20 pt-4">
                <span className="font-display text-2xl text-accent">{p.step}</span>
                <h3 className="mt-2 text-base font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-foreground/70">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section id="stories" className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Homeowners, in their words</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {stories.map((s) => (
              <figure key={s.name} className="border border-border bg-card p-6">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 font-display text-base leading-relaxed">“{s.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="block text-muted-foreground">{s.home}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs + consult */}
      <section id="faqs" className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Questions we hear often</h2>
            <Accordion type="single" collapsible className="mt-6">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div id="consult" className="border border-border bg-card p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold">Book a free design session</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {intent === "cost"
                ? "We will bring an itemised, fixed quote for your exact floor plan."
                : intent === "city"
                  ? "Tell us your city and we will match you with a designer there."
                  : "Tell us a little about your home. A designer calls you within 24 hours."}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <Input
                aria-label="Your name"
                placeholder="Your name"
                className="rounded-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                aria-label="Phone number"
                placeholder="Phone number"
                type="tel"
                inputMode="tel"
                className="rounded-none"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                aria-label="City"
                placeholder="City"
                className="rounded-none"
                value={form.city || geo.city || ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Textarea
                aria-label="About your home"
                placeholder="2BHK, possession in March, kitchen + wardrobes…"
                rows={3}
                className="rounded-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit" size="lg" className="w-full rounded-none">
                Request my free session
              </Button>
              <p className="text-xs text-muted-foreground">
                No spam, no site visit required for the first conversation.
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          <p className="font-display text-base font-bold">
            Home<span className="text-accent">Lane</span>
          </p>
          <p className="mt-1 text-sm text-ink-foreground/60">
            Interiors designed, made and installed by one team.
          </p>
          <p className="mt-4 text-xs text-ink-foreground/50">
            © {new Date().getFullYear()} HomeLane. Prices shown are indicative ranges, not quotes.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="border border-ink-foreground/20 bg-ink-foreground/5 p-4 backdrop-blur">{children}</div>;
}

function PriceModule() {
  return (
    <Card>
      <p className="text-[11px] uppercase tracking-wider text-accent">Indicative ranges, not a quote</p>
      <ul className="mt-3 divide-y divide-ink-foreground/15">
        {PRICE_BALLPARKS.map((p) => (
          <li key={p.config} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 py-2">
            <span className="min-w-0">
              <span className="text-sm font-semibold">{p.config}</span>
              <span className="block text-xs text-ink-foreground/60">{p.note}</span>
            </span>
            <span className="shrink-0 font-display text-sm font-semibold text-accent">{p.range}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CommitmentsModule() {
  return (
    <Card>
      <ul className="space-y-3">
        {COMMITMENTS.map((c) => (
          <li key={c.title} className="flex gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{c.title}</span>
              <span className="block text-xs text-ink-foreground/70">{c.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CityModule({
  selected,
  supported,
  onPick,
}: {
  selected: string | null;
  supported: boolean | null;
  onPick: (city: string) => void;
}) {
  return (
    <Card>
      {selected && supported !== null && (
        <p
          className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
            supported ? "text-accent" : "text-ink-foreground"
          }`}
        >
          {supported ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {supported
            ? `Yes — HomeLane designs and installs in ${selected}.`
            : `Not yet in ${selected}. Leave your number and we will tell you when we arrive.`}
        </p>
      )}
      <p className="text-[11px] uppercase tracking-wider text-accent">Pick your city</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SERVICE_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onPick(city)}
            className={`flex items-center gap-1 border px-2.5 py-1.5 text-xs transition-colors ${
              selected === city
                ? "border-accent bg-accent text-accent-foreground"
                : "border-ink-foreground/25 text-ink-foreground/80 hover:border-accent"
            }`}
          >
            <MapPin className="h-3 w-3" /> {city}
          </button>
        ))}
      </div>
    </Card>
  );
}

function CaptureModule({ onPick }: { onPick: (i: Intent) => void }) {
  return (
    <Card>
      <p className="text-[11px] uppercase tracking-wider text-accent">15-second intent capture</p>
      <div className="mt-3 grid gap-2">
        {CAPTURE_OPTIONS.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onPick(o.intent)}
            className="flex items-center justify-between border border-ink-foreground/25 px-3 py-2.5 text-left text-sm transition-colors hover:border-accent hover:bg-ink-foreground/10"
          >
            {o.label}
            <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
          </button>
        ))}
      </div>
    </Card>
  );
}

function OverviewModule() {
  return (
    <Card>
      <ul className="grid gap-2 sm:grid-cols-2">
        {["Fixed itemised price", "45-day installation", "10-year cabinetry warranty", "12 cities in India"].map(
          (t) => (
            <li key={t} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 shrink-0 text-accent" /> {t}
            </li>
          ),
        )}
      </ul>
    </Card>
  );
}
