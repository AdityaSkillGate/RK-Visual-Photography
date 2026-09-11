import React from "react";
import { Metadata } from "next";
import { getSiteSettings, getActiveSocialLinks } from "@/lib/supabase/queries";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import ContactForm from "./ContactForm";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  ShieldCheck,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import {
  InstagramIcon,
  YouTubeIcon,
  WhatsAppIcon,
  FacebookIcon,
  GoogleBusinessIcon,
} from "@/components/ui/SocialIcons";


import {
  JsonLd,
  getBreadcrumbSchema,
  getPhotographyBusinessSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Client Inquiries & Consultations | Reserve Your Date | RK Visual",
  description:
    "Commission RK Visual Photography for luxury South Indian weddings, destination celebrations, and fine-art portraits in Tamil Nadu, India, and worldwide.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Client Inquiries & Consultations | RK Visual Photography",
    description:
      "Commission RK Visual Photography for luxury South Indian weddings, intimate celebrations, and fine-art portraits.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Inquiries & Consultations | RK Visual Photography",
    description:
      "Commission RK Visual Photography for luxury South Indian weddings, intimate celebrations, and fine-art portraits.",
  },
};

interface ContactPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { service } = await searchParams;
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getActiveSocialLinks(),
  ]);

  const cleanPhone = settings.phone?.replace(/[^0-9+]/g, "") || "+919876543210";
  const whatsappUrl = `https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(
    "Hello RK Visual Studio, I would like to inquire about wedding photography availability."
  )}`;

  return (
    <div className="space-y-20 pb-32">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Consultation & Inquiries", url: "/contact" },
        ])}
      />
      <JsonLd data={getPhotographyBusinessSchema()} />
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 text-center pt-8">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-4">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Consultation
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-light text-ivory-100 tracking-tightest">
                Begin the Conversation
              </h1>
              <p className="max-w-md mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                We look forward to hearing your plans and crafting an enduring photographic heirloom for your celebration.
              </p>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Main Grid: Form + Studio Details */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal delay={0.1} yOffset={25}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Consultation Form */}
            <div className="lg:col-span-7">
              <ContactForm initialService={service} />
            </div>

            {/* Right: Studio Details & Direct Concierge */}
            <div className="lg:col-span-5 space-y-8">
              {/* Studio Direct Card */}
              <div className="rounded-3xl border border-bronze-border/70 bg-charcoal-900/40 p-6 sm:p-8 space-y-6 backdrop-blur-sm">
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                  Studio Concierge
                </span>

                <div className="space-y-4 text-xs font-light">
                  <div className="flex items-start gap-3 text-sand-300">
                    <MapPin size={16} className="text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-ivory-100 font-medium block">
                        Studio Base
                      </span>
                      <span>{settings.address || "Tamil Nadu, India"}</span>
                      <p className="text-[11px] text-sand-500 pt-0.5">
                        Available for destination travel across South India and worldwide.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sand-300">
                    <Mail size={16} className="text-gold-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-ivory-100 font-medium block">
                        Direct Email Consultation
                      </span>
                      <a
                        href={`mailto:${settings.email || "inquiries@rkvisual.com"}`}
                        className="hover:text-gold-400 text-gold-300/90 underline underline-offset-4 decoration-gold-500/30 transition-colors"
                      >
                        {settings.email || "inquiries@rkvisual.com"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sand-300">
                    <Phone size={16} className="text-gold-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-ivory-100 font-medium block">
                        Direct Telephone
                      </span>
                      <a
                        href={`tel:${cleanPhone}`}
                        className="hover:text-gold-400 text-gold-300/90 font-mono transition-colors"
                      >
                        {settings.phone || "+91 98765 43210"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Concierge CTA */}
                <div className="pt-2 border-t border-bronze-border/40">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 py-3.5 text-xs font-semibold uppercase tracking-editorial text-emerald-300 hover:bg-emerald-900/40 transition-all shadow-sm"
                  >
                    <WhatsAppIcon size={16} className="text-emerald-400" />
                    <span>Chat Directly via WhatsApp Concierge</span>
                  </a>
                </div>
              </div>


              {/* Social Channels & Broadcasts Card */}
              <div className="rounded-3xl border border-bronze-border/70 bg-charcoal-900/30 p-6 sm:p-8 space-y-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                    Broadcasts & Feed
                  </span>
                  <Share2 size={15} className="text-gold-400" />
                </div>

                <p className="text-xs text-sand-400 font-light leading-relaxed">
                  Follow our ongoing commissions and behind-the-scenes cinema across our verified studio channels.
                </p>

                <div className="space-y-2 pt-2 border-t border-bronze-border/30">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-bronze-border/50 bg-charcoal-850/60 hover:bg-charcoal-800 hover:border-gold-500/40 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        {link.platform === "instagram" ? (
                          <InstagramIcon size={15} className="text-pink-400" />
                        ) : link.platform === "youtube" ? (
                          <YouTubeIcon size={15} className="text-red-400" />
                        ) : link.platform === "whatsapp" ? (
                          <WhatsAppIcon size={15} className="text-emerald-400" />
                        ) : link.platform === "facebook" ? (
                          <FacebookIcon size={15} className="text-blue-400" />
                        ) : link.platform === "google_business" ? (
                          <GoogleBusinessIcon size={15} className="text-amber-400" />
                        ) : (
                          <Share2 size={15} className="text-gold-400" />
                        )}
                        <div>
                          <span className="text-xs font-medium text-ivory-100 block">
                            {link.label}
                          </span>
                          {link.handle && (
                            <span className="text-[10px] font-mono text-sand-500">
                              {link.handle}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight size={13} className="text-sand-500 group-hover:text-gold-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Consultation Standards */}
              <div className="rounded-3xl border border-bronze-border/50 bg-charcoal-900/20 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gold-400" />
                  <h3 className="font-display text-base text-ivory-100 font-light">
                    Prompt Response Guarantee
                  </h3>
                </div>
                <p className="text-xs text-sand-400 font-light leading-relaxed">
                  We personally review all submissions and respond within 24 business hours with availability, custom investment guides, and consultation options.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <ShieldCheck size={18} className="text-gold-400" />
                  <h3 className="font-display text-base text-ivory-100 font-light">
                    Calendar Exclusivity
                  </h3>
                </div>
                <p className="text-xs text-sand-400 font-light leading-relaxed">
                  Dates are secured on a first-confirmed basis with a signed agreement and deposit to protect our undivided artistic commitment.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </Container>
      </section>
    </div>
  );
}
