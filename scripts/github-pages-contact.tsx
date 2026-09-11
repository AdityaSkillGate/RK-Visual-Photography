import Link from "next/link";

export default function GitHubPagesContactPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-8 px-6 py-24 text-center">
      <span className="text-xs uppercase tracking-[0.3em] text-gold-400">
        Begin Your Story
      </span>
      <h1 className="font-display text-5xl font-light text-ivory-100 sm:text-7xl">
        Let&apos;s make something timeless.
      </h1>
      <p className="mx-auto max-w-xl text-sm leading-relaxed text-sand-300 sm:text-base">
        Reach RK Visual Photography directly to discuss your celebration,
        availability, and bespoke commission options.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gold-500 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-950"
        >
          Connect on WhatsApp
        </a>
        <Link
          href="/work/"
          className="rounded-full border border-bronze-border px-7 py-3 text-xs font-semibold uppercase tracking-widest text-sand-300"
        >
          View Selected Work
        </Link>
      </div>
    </main>
  );
}