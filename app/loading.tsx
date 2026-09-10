import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal-950 text-ivory-100">
      <div className="relative flex flex-col items-center space-y-6">
        <div className="relative h-16 w-16 animate-pulse overflow-hidden rounded-full border border-gold-500/40 p-1 shadow-gold-subtle">
          <Image
            src="/assets/logo/logo.png"
            alt="Loading RK Visual Photography"
            fill
            sizes="64px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-gold-400" />
          <p className="text-xs font-medium tracking-widest text-gold-400/90 uppercase">
            Loading Experience
          </p>
        </div>
      </div>
    </div>
  );
}
