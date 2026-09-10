import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getActiveServices } from "@/lib/supabase/queries";
import RKImage from "@/components/ui/RKImage";
import Container from "@/components/ui/Container";
import SectionReveal from "@/components/motion/SectionReveal";
import ImageReveal from "@/components/motion/ImageReveal";
import MagneticButton from "@/components/motion/MagneticButton";
import { Check, ArrowRight, ShieldCheck, Sparkles, BookOpen, Clock } from "lucide-react";
import {
  JsonLd,
  getBreadcrumbSchema,
  getPhotographyServiceSchema,
} from "@/lib/seo/structured-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services & Studio Offerings | Luxury Wedding Photography | RK Visual",
  description:
    "Explore bespoke photography collections for luxury South Indian weddings, cinematic 4K highlight films, pre-wedding destination sessions, and fine-art portraits.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services & Studio Offerings | RK Visual Photography",
    description:
      "Explore bespoke photography collections for luxury South Indian weddings, intimate celebrations, and fine-art portraits.",
    url: "/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services & Studio Offerings | RK Visual Photography",
    description:
      "Explore bespoke photography collections for luxury South Indian weddings, intimate celebrations, and fine-art portraits.",
  },
};

export default async function ServicesPage() {
  const services = await getActiveServices();

  const studioWorkflow = [
    {
      step: "01",
      title: "Discovery & Creative Alignment",
      description:
        "Every commission begins with an unhurried conversation. We delve into your schedule, family traditions, venue lighting, and personal aesthetic to craft a tailored coverage blueprint.",
    },
    {
      step: "02",
      title: "Unobtrusive Documentation",
      description:
        "During your celebrations, we blend seamless photojournalism with quiet editorial portrait direction. We let natural moments breathe without interrupting authentic emotion.",
    },
    {
      step: "03",
      title: "Master Color Crafting",
      description:
        "Each selected frame receives dedicated hand-tuning in our color suite. We honor true South Indian skin tones, luminous silks, and the golden glow of temple vilakku flames.",
    },
    {
      step: "04",
      title: "Archival Heirloom Delivery",
      description:
        "Your photographs are preserved in museum-grade Italian leather albums and delivered via a private, ultra-high-definition digital gallery accessible worldwide.",
    },
  ];

  return (
    <div className="space-y-24 pb-32">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ])}
      />
      <JsonLd
        data={services.map((svc) => getPhotographyServiceSchema(svc))}
      />
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 text-center pt-8">
        <Container size="narrow">
          <SectionReveal yOffset={25}>
            <div className="space-y-4">
              <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                Studio Offerings
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-light text-ivory-100 tracking-tightest">
                Bespoke Photography Commissions
              </h1>
              <p className="max-w-xl mx-auto text-xs sm:text-sm text-sand-400 font-light leading-relaxed">
                We accept a limited number of weddings and portrait sessions each season to guarantee undivided artistic focus, museum-grade color science, and timeless heirloom preservation.
              </p>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Services List */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <div className="space-y-16 lg:space-y-24">
            {services.map((service, index) => {
              const features = Array.isArray(service.features)
                ? (service.features as string[])
                : [];
              const isEven = index % 2 === 1;

              return (
                <SectionReveal key={service.id} delay={0.1} yOffset={30}>
                  <article
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center rounded-3xl border border-bronze-border/60 bg-charcoal-900/40 p-6 sm:p-10 lg:p-12 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/40 ${
                      isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Image Column */}
                    <div
                      className={`lg:col-span-6 ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <ImageReveal delay={0.15}>
                        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-2xl border border-bronze-border/80 shadow-2xl bg-charcoal-900">
                          <RKImage
                            src={service.cover_image_url || "/assets/logo/logo.png"}
                            alt={service.title}
                            preset="editorial"
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="rounded-full bg-charcoal-950/80 backdrop-blur-sm border border-bronze-border/70 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-gold-400">
                              0{index + 1} / Collection
                            </span>
                          </div>
                        </div>
                      </ImageReveal>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-6 space-y-6 ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div className="space-y-2">
                        <h2 className="font-display text-2xl sm:text-4xl font-light text-ivory-100 tracking-tight">
                          {service.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gold-300 font-light italic">
                          {service.summary}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features List */}
                      {features.length > 0 && (
                        <div className="space-y-2.5 pt-2 border-t border-bronze-border/40">
                          <span className="text-[11px] uppercase tracking-widest text-sand-400 font-semibold block">
                            Included In This Commission
                          </span>
                          <ul className="grid grid-cols-1 gap-2">
                            {features.map((feat, fIdx) => (
                              <li
                                key={fIdx}
                                className="flex items-start gap-2.5 text-xs text-sand-300 font-light"
                              >
                                <Check
                                  size={14}
                                  className="text-gold-400 shrink-0 mt-0.5"
                                />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-4 flex flex-wrap items-center gap-3">
                        <MagneticButton strength={0.2}>
                          <Link
                            href={`/contact?service=${encodeURIComponent(service.title)}`}
                            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
                          >
                            <span>Inquire About This Offering</span>
                            <ArrowRight size={13} />
                          </Link>
                        </MagneticButton>
                        <Link
                          href={`/services/${service.slug || service.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-bronze-border/80 px-5 py-3 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:text-ivory-100 hover:border-gold-500/50 transition-colors"
                        >
                          <span>Offering Specifications</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </SectionReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Studio Workflow */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal yOffset={30}>
            <div className="rounded-3xl border border-bronze-border/60 bg-charcoal-900/30 p-8 sm:p-14">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                <span className="text-overline uppercase tracking-widest text-gold-400 font-semibold block">
                  The Process
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100">
                  How We Bring Your Story to Life
                </h2>
                <p className="text-xs sm:text-sm text-sand-400 font-light">
                  From initial conceptual dialogue to the final heirloom reveal, every milestone is designed for calm reassurance and artistic excellence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {studioWorkflow.map((item) => (
                  <div
                    key={item.step}
                    className="space-y-4 border-l border-gold-500/30 pl-6 relative"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-gold-400 font-semibold">
                      {item.step}
                    </span>
                    <h3 className="font-display text-lg text-ivory-100 font-normal">
                      {item.title}
                    </h3>
                    <p className="text-xs text-sand-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Archival Quality Standards */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container size="wide">
          <SectionReveal yOffset={25}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-900/40 p-8 space-y-4 transition-all duration-300 hover:border-gold-500/30">
                <div className="h-10 w-10 rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-display text-xl text-ivory-100 font-light">
                  Permanent Copyright
                </h3>
                <p className="text-xs text-sand-400 font-light leading-relaxed">
                  Full private personal printing and display rights granted to every client with uncompressed master archive files.
                </p>
              </div>

              <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-900/40 p-8 space-y-4 transition-all duration-300 hover:border-gold-500/30">
                <div className="h-10 w-10 rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-display text-xl text-ivory-100 font-light">
                  Artisan Handcrafted Albums
                </h3>
                <p className="text-xs text-sand-400 font-light leading-relaxed">
                  Acid-free, 100% cotton rag archival paper bound in Italian full-grain leather, rated to withstand over a century without fading.
                </p>
              </div>

              <div className="rounded-2xl border border-bronze-border/60 bg-charcoal-900/40 p-8 space-y-4 transition-all duration-300 hover:border-gold-500/30">
                <div className="h-10 w-10 rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400">
                  <Clock size={20} />
                </div>
                <h3 className="font-display text-xl text-ivory-100 font-light">
                  Dedicated Lead Attention
                </h3>
                <p className="text-xs text-sand-400 font-light leading-relaxed">
                  Our principal artist personally photographs your main celebrations and supervises all post-production grade steps.
                </p>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Inquiry CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <Container size="narrow">
          <SectionReveal yOffset={30}>
            <div className="rounded-3xl border border-gold-500/30 bg-gradient-to-b from-charcoal-900 to-charcoal-950 p-8 sm:p-14 text-center space-y-6">
              <Sparkles size={24} className="mx-auto text-gold-400" />
              <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory-100 tracking-tight">
                Request Your Custom Proposal
              </h2>
              <p className="text-xs sm:text-sm text-sand-400 font-light max-w-md mx-auto leading-relaxed">
                Every celebration is singular. Share your dates and vision with us, and we will formulate an all-inclusive bespoke commission quote.
              </p>
              <div className="flex justify-center">
                <MagneticButton strength={0.25}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-charcoal-950 transition-all hover:bg-gold-400 shadow-gold-subtle"
                  >
                    <span>Check Availability & Dates</span>
                    <ArrowRight size={13} />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>
    </div>
  );
}
