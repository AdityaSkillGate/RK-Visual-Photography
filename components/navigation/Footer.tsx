import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getActiveSocialLinks } from "@/lib/supabase/queries";
import { ArrowUpRight } from "lucide-react";
import {
  InstagramIcon,
  YouTubeIcon,
  WhatsAppIcon,
  FacebookIcon,
  GoogleBusinessIcon,
} from "@/components/ui/SocialIcons";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = await getActiveSocialLinks();

  const getSocialIcon = (platform: string) => {
    const iconClass = "transition-colors group-hover:text-gold-300 text-sand-300";
    switch (platform.toLowerCase()) {
      case "instagram":
        return <InstagramIcon size={15} className={iconClass} />;
      case "youtube":
        return <YouTubeIcon size={15} className={iconClass} />;
      case "whatsapp":
        return <WhatsAppIcon size={15} className={iconClass} />;
      case "facebook":
        return <FacebookIcon size={15} className={iconClass} />;
      case "google_business":
        return <GoogleBusinessIcon size={15} className={iconClass} />;
      default:
        return <ArrowUpRight size={15} className={iconClass} />;
    }
  };

  return (
    <footer className="border-t border-bronze-border/50 bg-charcoal-950 text-ivory-100">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gold-500/40 p-0.5">
                <Image
                  src="/assets/logo/logo.png"
                  alt="RK Visual Photography"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="font-display text-2xl tracking-widest text-ivory-100 uppercase">
                RK Visual
              </span>
            </div>
            <p className="max-w-sm text-sm text-sand-400 font-light leading-relaxed">
              Capturing stories that last beyond the moment. Premium wedding,
              portrait, and editorial cinematic photography based in Tamil Nadu, India.
            </p>
            <div className="text-xs tracking-editorial text-gold-400 uppercase">
              Tamil Nadu, India • Available Worldwide
            </div>

            {/* Social Icons Quick Row */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-bronze-border/80 bg-charcoal-900/80 text-sand-300 hover:border-gold-500/50 hover:bg-charcoal-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  aria-label={link.label}
                  title={link.label}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-sand-400 font-light">
              <li>
                <Link href="/work" className="transition-colors hover:text-gold-300">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/stories" className="transition-colors hover:text-gold-300">
                  Stories & Journal
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition-colors hover:text-gold-300">
                  Services & Offerings
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-gold-300">
                  About the Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social Media Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-sand-400 font-light">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-300 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Inquiries */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
              Inquiries
            </h4>
            <ul className="space-y-2 text-sm text-sand-400 font-light">
              <li>
                <Link href="/contact" className="transition-colors hover:text-gold-300 font-medium text-ivory-100">
                  Book a Consultation
                </Link>
              </li>
              <li>
                <span className="text-ivory-300">contact@rkvisual.com</span>
              </li>
              <li>
                <span className="text-sand-500 text-xs">Mon - Sat: 10:00 AM - 7:00 PM</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-1.5 text-xs text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                >
                  <WhatsAppIcon size={13} />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-bronze-border/30 pt-8 text-xs text-sand-500 md:flex-row">
          <p>© {currentYear} RK Visual Photography. All rights reserved.</p>
          <p className="tracking-editorial uppercase text-[11px] text-sand-600">
            Crafted for Timeless Visuals
          </p>
        </div>
      </div>
    </footer>
  );
}
