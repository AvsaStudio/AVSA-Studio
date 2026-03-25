import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[90vh] bg-[var(--cream)] px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500 font-medium">
            Photography Studio
          </p>
          <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-[var(--charcoal)] leading-tight">
            Every moment,<br />beautifully held.
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-md mx-auto">
            AVSA Studio offers intentional, editorial photography sessions
            tailored to you. Portraits, events, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center h-12 px-8 bg-[var(--charcoal)] text-white text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors rounded-full"
            >
              View Services
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center h-12 px-8 border border-stone-300 text-stone-700 text-sm font-medium tracking-wide hover:bg-stone-100 transition-colors rounded-full"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-widest text-stone-400">
              About the Studio
            </p>
            <h2 className="text-3xl font-light text-[var(--charcoal)] leading-snug">
              Photography with presence and intention
            </h2>
            <p className="text-stone-600 leading-relaxed">
              AVSA Studio is a boutique photography practice built on trust,
              artistry, and care. Each session is curated from first inquiry
              to final gallery delivery.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900 transition-colors"
            >
              Explore services →
            </Link>
          </div>
          <div className="aspect-[4/5] bg-stone-100 rounded-2xl" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[var(--cream)] text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-light text-[var(--charcoal)]">
            Ready to book your session?
          </h2>
          <p className="text-stone-600">
            Choose a service, pick your date, and secure your spot in minutes.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center h-12 px-8 bg-[var(--charcoal)] text-white text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors rounded-full"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
