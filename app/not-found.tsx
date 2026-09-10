import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-lg space-y-6">
        <span className="font-display text-7xl font-light tracking-widest text-gold-500/80">
          404
        </span>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-light text-ivory-100 sm:text-4xl">
            Moment Not Found
          </h1>
          <p className="text-sm font-light text-sand-400">
            The page or visual story you are looking for does not exist or has
            been relocated.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-gold-500/50 bg-gold-500/10 px-6 py-2.5 text-xs font-medium tracking-editorial text-gold-300 transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/20 hover:text-ivory-50"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
