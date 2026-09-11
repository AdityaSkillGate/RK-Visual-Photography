/**
 * RK Visual Photography — V2 Design System Tokens & Asset Map
 * Reference: docs/v2-revamp-plan.md and plan-2-design.md
 */

// ==============================================================================
// 1. V2 COLOR TOKENS
// ==============================================================================
export const V2_COLORS = {
  // Dark Canvas Foundations
  charcoal: {
    deep: "#141414", // Primary luxury dark canvas
    soft: "#1D1D1B", // Elevated cards, panels, and dropdowns
    surface: "#222220",
    border: "#2C2C28",
  },

  // Light / Ivory Editorial Surfaces
  ivory: {
    paper: "#FAF8F5", // Crisp light paper canvas
    warm: "#F4F0E8", // Signature warm ivory surface
    card: "#EDE8DD", // Subtle elevated light card
    border: "#DDD5C5", // Hairline border for light sections
    textPrimary: "#1C1B19", // High contrast luxury typography on light
    textSecondary: "#59544D", // Muted editorial secondary on light
    textMuted: "#807A71",
  },

  // Warm Neutral & Metal Accents
  champagne: {
    light: "#F7F3EB",
    base: "#E7DDCA", // Signature warm champagne
    dark: "#C5B491",
  },

  gold: {
    antique: "#C5A880", // Signature RK antique gold
    muted: "#B88A3B", // Restrained antique gold
    subtle: "#E2CCA8",
    glow: "rgba(197, 168, 128, 0.2)",
  },

  taupe: {
    light: "#ABA091",
    base: "#8D806D", // Signature warm taupe
    dark: "#625746",
  },
} as const;

// ==============================================================================
// 2. STUDIO REAL PHOTOGRAPHY ASSET MAP
// Discovered directly from repository: public/assets/images
// ==============================================================================
export const STUDIO_ASSETS = {
  // Hero & Panoramic Stories
  hero: {
    sunsetCouple: {
      src: "/assets/images/image.png",
      alt: "Golden hour couple silhouette holding the setting sun",
      category: "Cinematic Sunset",
      orientation: "landscape",
      width: 1280,
      height: 853,
    },
    windyBeachGown: {
      src: "/assets/images/image9.png",
      alt: "Dramatic windy beach pre-wedding portrait with billowing crimson gown",
      category: "Pre-Wedding",
      orientation: "landscape",
      width: 1600,
      height: 1067,
    },
    lakeBoatRide: {
      src: "/assets/images/image10.png",
      alt: "Romantic lake boat ride couple portrait with traditional boatman",
      category: "Heritage Couple",
      orientation: "landscape",
      width: 1280,
      height: 853,
    },
  },

  // Luxury South Indian Weddings
  weddings: {
    receptionStageProposal: {
      src: "/assets/images/image8.png",
      alt: "Luxury wedding reception moment: groom kissing bride's hand under chandelier",
      category: "Luxury Wedding",
      orientation: "landscape",
      width: 1600,
      height: 1067,
    },
    bridalPreparation: {
      src: "/assets/images/image6.png",
      alt: "South Indian bride in red Kanchipuram silk saree adjusting earring before floral backdrop",
      category: "Bridal Rituals",
      orientation: "portrait",
      width: 1200,
      height: 1600,
    },
    receptionCoupleNight: {
      src: "/assets/images/image5.png",
      alt: "Wedding reception couple portrait in royal blue and gold silk",
      category: "Wedding Reception",
      orientation: "landscape",
      width: 1600,
      height: 1067,
    },
  },

  // Pre-Wedding Sessions & Journey
  preWedding: {
    bulletSunsetRide: {
      src: "/assets/images/image7.png",
      alt: "Joyful pre-wedding couple on a Royal Enfield bullet motorcycle at sunset",
      category: "Pre-Wedding",
      orientation: "landscape",
      width: 1280,
      height: 853,
    },
  },

  // Fine-Art Portraits
  portraits: {
    templeJewelryGirl: {
      src: "/assets/images/image4.png",
      alt: "Traditional South Indian ceremony portrait with heritage temple jewelry",
      category: "Fine-Art Portrait",
      orientation: "landscape",
      width: 1280,
      height: 800,
    },
    babyVelvetTwilight: {
      src: "/assets/images/image3.png",
      alt: "Twilight meadow fine-art portrait of baby girl in velvet dress",
      category: "Baby & Portrait",
      orientation: "landscape",
      width: 1600,
      height: 1067,
    },
  },

  // Kids & Candid Family Milestones
  kidsAndFamily: {
    childCarHood: {
      src: "/assets/images/image1.png",
      alt: "Outdoor child portrait sitting on car bonnet with natural smile",
      category: "Kids & Family",
      orientation: "landscape",
      width: 1600,
      height: 1067,
    },
    toddlerTricycle: {
      src: "/assets/images/image2.png",
      alt: "Candid smiling toddler on blue tricycle in golden light",
      category: "Kids & Family",
      orientation: "portrait",
      width: 1067,
      height: 1600,
    },
  },
} as const;

// ==============================================================================
// 3. EXPERIENCE & METRIC TOKENS
// ==============================================================================
export interface ExperienceMetric {
  id: string;
  order: number;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  description: string;
}

export const DEFAULT_EXPERIENCE_METRICS: ExperienceMetric[] = [
  {
    id: "media_experience",
    order: 1,
    value: 10,
    suffix: "+ Years",
    label: "Media Experience",
    sublabel: "A Decade of Mastery",
    description: "Dedicated to fine-art storytelling and visual excellence.",
  },
  {
    id: "weddings_shot",
    order: 2,
    value: 500,
    suffix: "+",
    label: "Weddings Captured",
    sublabel: "Sacred Unions",
    description: "Preserving sacred rituals, raw emotions, and timeless muhurthams.",
  },
  {
    id: "events_managed",
    order: 3,
    value: 250,
    suffix: "+",
    label: "Events Managed",
    sublabel: "Celebrations & Galas",
    description: "Flawless coverage of heritage festivals, receptions, and family galas.",
  },
  {
    id: "happy_clients",
    order: 4,
    value: 1000,
    suffix: "+",
    label: "Happy Clients",
    sublabel: "Heirloom Stories",
    description: "Families worldwide treasuring our handcrafted wedding albums.",
  },
];

// ==============================================================================
// 4. MOTION & TIMING TOKENS
// ==============================================================================
export const V2_MOTION = {
  durations: {
    instant: 0.15,
    quick: 0.35,
    editorial: 0.75,
    cinematic: 1.2,
    ambient: 8.0,
  },
  easings: {
    editorial: [0.16, 1, 0.3, 1] as const, // Apple/Editorial spring curve
    smooth: [0.25, 0.1, 0.25, 1] as const,
    cinematic: [0.33, 1, 0.68, 1] as const,
  },
} as const;
