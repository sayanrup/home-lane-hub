import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Clock3,
  IndianRupee,
  LayoutGrid,
  Ruler,
  ShieldCheck,
  Sofa,
  Star,
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

import heroLiving from "@/assets/hero-living.jpg";
import kitchenImg from "@/assets/kitchen.jpg";
import bedroomImg from "@/assets/bedroom.jpg";
import studyImg from "@/assets/study.jpg";
import wardrobeImg from "@/assets/wardrobe.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const navLinks = [
  { label: "Spaces", href: "#spaces" },
  { label: "How it works", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Stories", href: "#stories" },
  { label: "FAQs", href: "#faqs" },
];

const spaces = [
  {
    title: "Modular kitchens",
    copy: "Soft-close hardware, moisture-proof cores and layouts planned around how you actually cook.",
    img: kitchenImg,
    icon: ChefHat,
  },
  {
    title: "Bedrooms",
    copy: "Warm palettes, storage-first beds and headboards made to your ceiling height.",
    img: bedroomImg,
    icon: Sofa,
  },
  {
    title: "Wardrobes",
    copy: "Sliding, hinged or walk-in — fitted wall to wall with zero dead corners.",
    img: wardrobeImg,
    icon: LayoutGrid,
  },
  {
    title: "Studies & storage",
    copy: "Work nooks, crockery units and TV walls that borrow no floor space.",
    img: studyImg,
    icon: Ruler,
  },
];

const process = [
  { step: "01", title: "Meet a designer", copy: "Share your floor plan, budget and taste. Free, no obligation." },
  { step: "02", title: "See it in 3D", copy: "Walk through your home in a live 3D session and change anything." },
  { step: "03", title: "Lock the price", copy: "One itemised quote. No revisions to the number later." },
  { step: "04", title: "Move in", copy: "Factory-made, site-installed and handed over in 45 days." },
];

const pricing = [
  {
    name: "Essentials",
    price: "3.5",
    blurb: "Kitchen and wardrobes for a 2BHK",
    points: ["Modular kitchen", "2 wardrobes", "Standard finishes", "10-year warranty"],
  },
  {
    name: "Signature",
    price: "6.5",
    blurb: "Full-home interiors for a 3BHK",
    points: ["Kitchen + 3 wardrobes", "TV and crockery units", "False ceiling & lighting", "Premium finishes"],
    featured: true,
  },
  {
    name: "Bespoke",
    price: "12",
    blurb: "Villas and larger homes",
    points: ["Designer-led concept", "Imported finishes", "Furniture & decor styling", "Dedicated project lead"],
  },
];

const stories = [
  {
    quote:
      "The 3D session sold it for us. What we saw on screen is exactly what got installed, down to the brass handles.",
    name: "Ananya & Rohit",
    home: "3BHK, Whitefield, Bengaluru",
  },
  {
    quote:
      "Handover was four days early. The kitchen storage plan alone changed how we use the house.",
    name: "Meera Nair",
    home: "2BHK, Powai, Mumbai",
  },
  {
    quote:
      "Fixed pricing meant no arguments at the end. That is rare in this business.",
    name: "Vikram Sethi",
    home: "Villa, Gurugram",
  },
];

const faqs = [
  {
    q: "How long does a full home take?",
    a: "Most 2 and 3BHK homes are designed in two weeks and installed in 45 days from the day the design is frozen.",
  },
  {
    q: "Is the quote really fixed?",
    a: "Yes. Once you approve the itemised quote, the price stays put unless you ask for a change in scope.",
  },
  {
    q: "What does the warranty cover?",
    a: "10 years on modular cabinetry and 1 year on services such as painting, electrical and false ceiling.",
  },
  {
    q: "Can I do only my kitchen?",
    a: "Absolutely. Plenty of homeowners start with the kitchen or wardrobes and come back for the rest later.",
  },
];

function Index() {
  const [form, setForm] = useState({ name: "", phone: "", city: "", message: "" });

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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a href="#top" className="font-display text-xl font-bold tracking-tight">
            Home<span className="text-primary">Lane</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <Button asChild size="sm" className="rounded-none px-5">
            <a href="#consult">Book free design session</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        <img
          src={heroLiving}
          alt="Warm modern living room designed by HomeLane"
          width={1920}
          height={1200}
          className="h-[78vh] min-h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
            <div className="max-w-xl text-ink-foreground">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">
                Interiors, end to end
              </p>
              <h1 className="font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
                Homes that feel finished, not furnished.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-ink-foreground/80 sm:text-lg">
                Design, manufacture and installation under one roof — with a price
                that is fixed before we start and a home that is ready in 45 days.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none px-7">
                  <a href="#consult">
                    Book a free design session <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-none border-ink-foreground/40 bg-transparent px-7 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
                >
                  <a href="#spaces">See our work</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 lg:grid-cols-4 lg:px-10">
          {[
            { icon: IndianRupee, label: "Fixed pricing", sub: "Quoted once, honoured always" },
            { icon: Clock3, label: "45-day install", sub: "Or we pay you for delays" },
            { icon: ShieldCheck, label: "10-year warranty", sub: "On all modular cabinetry" },
            { icon: Star, label: "20,000+ homes", sub: "Delivered across 20 cities" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <item.icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spaces */}
      <section id="spaces" className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">What we design</p>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Every room, measured for your walls
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nothing here is off the shelf. Each unit is drawn to your floor plan,
            built in our factory and fitted on site by our own crew.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {spaces.map((s) => (
            <article
              key={s.title}
              className="group overflow-hidden border border-border bg-card transition-shadow hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  width={1200}
                  height={1200}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <s.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">How it works</p>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Four steps from floor plan to housewarming
            </h2>
          </div>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="border-t border-ink-foreground/20 pt-5">
                <span className="font-display text-3xl text-accent">{p.step}</span>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Indicative pricing</p>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Know the number before you commit
          </h2>
          <p className="mt-4 text-muted-foreground">
            Starting prices for typical homes. Your designer converts this into an
            itemised, fixed quote after the first session.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col border p-8 ${
                p.featured
                  ? "border-primary bg-secondary shadow-xl"
                  : "border-border bg-card"
              }`}
            >
              {p.featured && (
                <span className="mb-4 w-fit bg-primary px-3 py-1 text-[11px] uppercase tracking-wider text-primary-foreground">
                  Most chosen
                </span>
              )}
              <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-6 font-display text-4xl font-semibold">
                ₹{p.price}L<span className="text-base font-normal text-muted-foreground"> onwards</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{pt}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? "default" : "outline"}
                className="mt-8 w-full rounded-none"
              >
                <a href="#consult">Get a fixed quote</a>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section id="stories" className="bg-secondary">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Homeowners, in their words
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stories.map((s) => (
              <figure key={s.name} className="border border-border bg-card p-8">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 font-display text-lg leading-relaxed">
                  “{s.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="block text-muted-foreground">{s.home}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs + Consult */}
      <section id="faqs" className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Good to know</p>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Questions we hear often
            </h2>
            <Accordion type="single" collapsible className="mt-8">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div id="consult" className="border border-border bg-card p-8 lg:p-10">
            <h2 className="font-display text-2xl font-semibold">Book a free design session</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us a little about your home. A designer calls you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
                  className="rounded-none"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <Input
                aria-label="City"
                placeholder="City"
                className="rounded-none"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Textarea
                aria-label="About your home"
                placeholder="2BHK, possession in March, looking at kitchen + wardrobes…"
                rows={4}
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

      {/* Footer */}
      <footer className="border-t border-border bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="font-display text-lg font-bold">
              Home<span className="text-accent">Lane</span>
            </p>
            <p className="mt-1 text-sm text-ink-foreground/60">
              Interiors designed, made and installed by one team.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-ink-foreground/70">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-accent">
                {l.label}
              </a>
            ))}
          </nav>
          <p className="text-xs text-ink-foreground/50">
            © {new Date().getFullYear()} HomeLane
          </p>
        </div>
      </footer>
    </div>
  );
}
