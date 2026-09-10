import React from "react";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";
import Badge from "@/components/ui/Badge";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import ImageWrapper from "@/components/ui/ImageWrapper";
import Skeleton from "@/components/ui/Skeleton";
import { Sparkles, Camera, ArrowRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Design System | RK Visual Photography",
  description: "Internal design system showcase and component library preview.",
};

export default function DesignSystemPage() {
  return (
    <div className="py-12 sm:py-16 space-y-24">
      {/* Top Intro */}
      <Container size="default">
        <SectionHeading
          eyebrow="RK Visual Photography • Internal"
          title={
            <span>
              Design System &amp;{" "}
              <span className="italic text-gold-300">Component Catalog</span>
            </span>
          }
          description="A reusable, luxury editorial design architecture crafted with deep charcoal canvases, warm ivory typography, restrained antique gold accents, and WCAG AA accessible interactive primitives."
        />
      </Container>

      {/* 1. Color Palette Tokens */}
      <Container size="default">
        <div className="space-y-8">
          <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
            01. Color Palette Tokens
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
            {/* Charcoal 950 */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-charcoal-950 border border-bronze-border flex items-end p-2.5 shadow-inner">
                <span className="text-[10px] text-ivory-300 font-mono">#0B0C0E</span>
              </div>
              <p className="font-medium text-ivory-100">charcoal-950</p>
              <p className="text-[11px] text-sand-500">Canvas background</p>
            </div>

            {/* Charcoal 900 */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-charcoal-900 border border-bronze-border flex items-end p-2.5">
                <span className="text-[10px] text-ivory-300 font-mono">#111215</span>
              </div>
              <p className="font-medium text-ivory-100">charcoal-900</p>
              <p className="text-[11px] text-sand-500">Elevated cards &amp; bars</p>
            </div>

            {/* Charcoal 850 */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-charcoal-850 border border-bronze-border flex items-end p-2.5">
                <span className="text-[10px] text-ivory-300 font-mono">#16181D</span>
              </div>
              <p className="font-medium text-ivory-100">charcoal-850</p>
              <p className="text-[11px] text-sand-500">Surface hover states</p>
            </div>

            {/* Gold 500 (Signature) */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-gold-500 border border-gold-400 flex items-end p-2.5 text-charcoal-950 shadow-gold-subtle">
                <span className="text-[10px] font-mono font-semibold">#C5A880</span>
              </div>
              <p className="font-medium text-gold-300">gold-500</p>
              <p className="text-[11px] text-sand-500">Antique gold signature</p>
            </div>

            {/* Gold 400 */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-gold-400 border border-gold-300 flex items-end p-2.5 text-charcoal-950">
                <span className="text-[10px] font-mono font-semibold">#D4AF37</span>
              </div>
              <p className="font-medium text-gold-300">gold-400</p>
              <p className="text-[11px] text-sand-500">Gold hover &amp; focus</p>
            </div>

            {/* Ivory 100 */}
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-ivory-100 border border-bronze-border flex items-end p-2.5 text-charcoal-950">
                <span className="text-[10px] font-mono font-semibold">#F7F5F0</span>
              </div>
              <p className="font-medium text-ivory-100">ivory-100</p>
              <p className="text-[11px] text-sand-500">Primary warm text</p>
            </div>
          </div>
        </div>
      </Container>

      {/* 2. Typography Scale */}
      <Container size="default">
        <div className="space-y-8">
          <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
            02. Editorial Typography Scale
          </h3>

          <div className="space-y-6 rounded-2xl border border-bronze-border/50 bg-charcoal-900/60 p-6 sm:p-8">
            <div className="space-y-1">
              <span className="text-overline text-gold-400 uppercase">Display 2XL • Cormorant Garamond</span>
              <p className="font-display text-4xl sm:text-6xl text-ivory-100 font-light">
                Timeless Cinematic Moments
              </p>
            </div>

            <div className="space-y-1 border-t border-bronze-border/40 pt-4">
              <span className="text-overline text-gold-400 uppercase">Display LG • Cormorant Garamond</span>
              <p className="font-display text-3xl sm:text-4xl text-ivory-100 font-light">
                Stories Crafted With Artistry
              </p>
            </div>

            <div className="space-y-1 border-t border-bronze-border/40 pt-4">
              <span className="text-overline text-gold-400 uppercase">Body Large • Plus Jakarta Sans</span>
              <p className="font-sans text-lg text-ivory-200 font-light max-w-2xl leading-relaxed">
                Capturing emotions across Tamil Nadu and beyond, blending classical fine-art composition with contemporary documentary intuition.
              </p>
            </div>

            <div className="space-y-1 border-t border-bronze-border/40 pt-4">
              <span className="text-overline text-gold-400 uppercase">Body Base &amp; Caption</span>
              <p className="font-sans text-sm text-sand-400 leading-relaxed max-w-2xl">
                Every frame is treated as an editorial portrait. Unobtrusive guidance and natural light create heartfelt memories that endure generations.
              </p>
              <p className="text-caption text-sand-500 pt-1">
                EXIF: 85mm f/1.4 • ISO 200 • 1/500s • Natural Ambient Light
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. Buttons & Interactive Focus States */}
      <Container size="default">
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-bronze-border/50 pb-3">
            <h3 className="font-display text-2xl text-ivory-100">
              03. Buttons &amp; Focus States (WCAG AA)
            </h3>
            <Badge variant="gold" size="sm" dot>
              Keyboard Navigable
            </Badge>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="md">
                Primary Button
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight size={14} />}
              >
                With Right Icon
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Camera size={14} />}
              >
                Secondary Button
              </Button>
              <Button variant="outline" size="md">
                Outline Variant
              </Button>
              <Button variant="ghost" size="md">
                Ghost Variant
              </Button>
              <Button variant="primary" size="md" isLoading>
                Loading State
              </Button>
              <Button variant="secondary" size="md" disabled>
                Disabled
              </Button>
            </div>

            {/* Sizes demo */}
            <div className="flex flex-wrap items-center gap-4 border-t border-bronze-border/30 pt-4">
              <Button variant="primary" size="sm">
                Small (sm)
              </Button>
              <Button variant="primary" size="md">
                Medium (md)
              </Button>
              <Button variant="primary" size="lg">
                Large (lg)
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* 4. Badges & Links */}
      <Container size="default">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Badges */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
              04. Badges &amp; Status Indicators
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="gold" dot>
                Weddings
              </Badge>
              <Badge variant="gold">Signature Series</Badge>
              <Badge variant="charcoal" dot>
                Pre-Wedding
              </Badge>
              <Badge variant="outline">Portraits</Badge>
              <Badge variant="subtle">Tamil Nadu</Badge>
              <Badge variant="gold" size="sm">
                Featured
              </Badge>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
              05. Text Links
            </h3>
            <div className="flex flex-wrap items-center gap-6">
              <TextLink href="/work" variant="gold" showArrow>
                Explore Selected Work
              </TextLink>
              <TextLink href="/stories" variant="ivory" showArrow>
                Read Journal Stories
              </TextLink>
              <TextLink href="/services" variant="muted">
                View Services &amp; Packages
              </TextLink>
            </div>
          </div>
        </div>
      </Container>

      {/* 6. Section Heading System */}
      <Container size="default">
        <div className="space-y-8">
          <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
            06. Section Heading System
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="glass">
              <SectionHeading
                eyebrow="Left Aligned Heading"
                title="Curated Love Stories"
                description="Each wedding gallery represents an individual chapter documented with genuine sentiment and unposed elegance."
                action={
                  <TextLink href="/work" variant="gold" showArrow>
                    View Weddings Portfolio
                  </TextLink>
                }
              />
            </Card>

            <Card variant="glass">
              <SectionHeading
                align="center"
                eyebrow="Center Aligned Heading"
                title="The Editorial Philosophy"
                description="We believe natural human connections transcend momentary trends. Every frame is preserved to remain timeless decades hence."
              />
            </Card>
          </div>
        </div>
      </Container>

      {/* 7. Card System */}
      <Container size="default">
        <div className="space-y-8">
          <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
            07. Card System
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Elevated Interactive Card */}
            <Card variant="elevated" isInteractive>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="sm">
                    Wedding Story
                  </Badge>
                  <span className="text-caption text-sand-500 font-mono">01</span>
                </div>
                <CardTitle>Arun &amp; Priya</CardTitle>
                <CardDescription>
                  A three-day traditional ceremony set against heritage architecture in Chennai, Tamil Nadu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-40 w-full overflow-hidden rounded-lg bg-charcoal-850">
                  <ImageWrapper
                    src="/assets/logo/logo.png"
                    alt="Sample Shoot"
                    aspectRatio="cinematic"
                    overlay="gradient"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <span>Chennai, India</span>
                <span className="text-gold-400 font-medium">Explore Gallery →</span>
              </CardFooter>
            </Card>

            {/* Outline Card */}
            <Card variant="outline">
              <CardHeader>
                <Badge variant="outline" size="sm">
                  Service Offering
                </Badge>
                <CardTitle>Pre-Wedding Films</CardTitle>
                <CardDescription>
                  Cinematic vignettes capturing spontaneous intimacy before the celebration begins.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-sand-400 leading-relaxed">
                  Full day coverage, color graded 4K cinematic delivery, drone cinematography where permitted.
                </p>
              </CardContent>
              <CardFooter>
                <span>Full Day Coverage</span>
                <TextLink href="/services" variant="gold">
                  Details
                </TextLink>
              </CardFooter>
            </Card>

            {/* Glassmorphism Card */}
            <Card variant="glass">
              <CardHeader>
                <Badge variant="subtle" size="sm">
                  Client Review
                </Badge>
                <CardTitle className="italic font-display text-lg">
                  &ldquo;Every photograph felt like the moment itself came back to life.&rdquo;
                </CardTitle>
                <CardDescription>— Karthik &amp; Divya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-gold-400">
                  <Heart size={14} fill="currentColor" />
                  <Heart size={14} fill="currentColor" />
                  <Heart size={14} fill="currentColor" />
                  <Heart size={14} fill="currentColor" />
                  <Heart size={14} fill="currentColor" />
                </div>
              </CardContent>
              <CardFooter>
                <span>Tirunelveli, Tamil Nadu</span>
                <span className="text-sand-500">Verified Client</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Container>

      {/* 8. Photographic Image Wrappers & Skeletons */}
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Wrappers */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
              08. Photographic Image Wrappers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <ImageWrapper
                  src="/assets/logo/logo.png"
                  alt="Portrait Aspect"
                  aspectRatio="portrait"
                  overlay="gradient"
                />
                <p className="text-caption text-sand-500 text-center">
                  Portrait (3:4 Aspect)
                </p>
              </div>
              <div className="space-y-2">
                <ImageWrapper
                  src="/assets/logo/logo.png"
                  alt="Square Aspect"
                  aspectRatio="square"
                  overlay="subtle"
                />
                <p className="text-caption text-sand-500 text-center">
                  Square (1:1 Aspect)
                </p>
              </div>
            </div>
          </div>

          {/* Skeletons & Loading States */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl text-ivory-100 border-b border-bronze-border/50 pb-3">
              09. Loading State Skeletons
            </h3>
            <div className="space-y-4 rounded-2xl border border-bronze-border/40 bg-charcoal-900/40 p-6">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="h-12 w-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-4 w-1/3" />
                  <Skeleton variant="text" className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton variant="image" className="h-44" />
              <div className="space-y-2 pt-2">
                <Skeleton variant="text" className="h-4 w-3/4" />
                <Skeleton variant="text" className="h-3 w-full" />
                <Skeleton variant="text" className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
