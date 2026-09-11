/**
 * RK Visual Photography — Studio Photography Asset Configuration Layer
 * 
 * Maps and configures all 11 authentic photographs discovered in `public/assets/images`.
 * Decouples public UI presentation from media delivery and allows easy reassignment.
 */

export interface StudioImage {
  id: string;
  filename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number; // width / height
  orientation: "landscape" | "portrait";
  category: "wedding" | "couple/pre-wedding" | "portraits" | "events" | "studio/team" | "kids/family";
  title: string;
  description: string;
  alt: string;
  location: string;
  tags: string[];
}

// ==============================================================================
// 1. INVENTORY OF AUTHENTIC STUDIO ASSETS
// ==============================================================================
export const STUDIO_INVENTORY: Record<string, StudioImage> = {
  "hero-sunset-silhouette": {
    id: "hero-sunset-silhouette",
    filename: "image.png",
    src: "/assets/images/image.png",
    width: 1280,
    height: 853,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "couple/pre-wedding",
    title: "Twilight Silhouette & Setting Sun",
    description: "Intimate couple silhouette framing the golden hour sun against coastal palms.",
    alt: "Fine-art couple silhouette holding the setting sun by RK Visual Photography",
    location: "Pappakudi / Coastal Tamil Nadu",
    tags: ["sunset", "silhouette", "golden hour", "dramatic light", "pre-wedding"],
  },

  "kids-car-portrait": {
    id: "kids-car-portrait",
    filename: "image1.png",
    src: "/assets/images/image1.png",
    width: 1600,
    height: 1066,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "kids/family",
    title: "Candid Child Portrait on Bonnet",
    description: "Bright, natural-light outdoor portrait of child seated on a car bonnet.",
    alt: "Outdoor child portrait in yellow outfit by RK Visual Photography",
    location: "Tamil Nadu, India",
    tags: ["kids", "family", "candid", "natural light", "outdoor"],
  },

  "kids-tricycle-smile": {
    id: "kids-tricycle-smile",
    filename: "image2.png",
    src: "/assets/images/image2.png",
    width: 1066,
    height: 1600,
    aspectRatio: 0.67,
    orientation: "portrait",
    category: "kids/family",
    title: "Toddler Joy on Tricycle",
    description: "Vertical candid capturing joyful toddler riding a blue tricycle in lush sunlight.",
    alt: "Smiling toddler on tricycle outdoor photoshoot by RK Visual Photography",
    location: "Tamil Nadu, India",
    tags: ["kids", "toddler", "candid", "portrait", "sunlight"],
  },

  "baby-velvet-twilight": {
    id: "baby-velvet-twilight",
    filename: "image3.png",
    src: "/assets/images/image3.png",
    width: 1600,
    height: 1067,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "portraits",
    title: "Velvet Meadow Baby Twilight",
    description: "Moody blue-hour outdoor meadow portrait of baby girl in deep sapphire velvet.",
    alt: "Baby portrait in sapphire velvet dress on twilight grass by RK Visual Photography",
    location: "Tamil Nadu, India",
    tags: ["baby", "twilight", "blue hour", "fine art", "portrait"],
  },

  "heritage-temple-jewelry": {
    id: "heritage-temple-jewelry",
    filename: "image4.png",
    src: "/assets/images/image4.png",
    width: 1280,
    height: 768,
    aspectRatio: 1.67,
    orientation: "landscape",
    category: "portraits",
    title: "Heirloom Gold Temple Adornment",
    description: "Traditional South Indian ceremony portrait celebrating heirloom temple jewellery and kanjivaram silk.",
    alt: "South Indian traditional ceremony portrait with gold temple jewelry by RK Visual",
    location: "Madurai / Chettinad, Tamil Nadu",
    tags: ["heritage", "temple jewelry", "kanjivaram", "traditional", "fine art"],
  },

  "reception-couple-night": {
    id: "reception-couple-night",
    filename: "image5.png",
    src: "/assets/images/image5.png",
    width: 1600,
    height: 1066,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "wedding",
    title: "Royal Blue Wedding Reception Gala",
    description: "Couple portrait in royal blue silk saree and navy suit with illuminated garden bokeh.",
    alt: "Wedding reception couple portrait in royal blue silk by RK Visual Photography",
    location: "Tamil Nadu, India",
    tags: ["wedding", "reception", "royal blue", "couple", "night gala"],
  },

  "bridal-kanchipuram-ritual": {
    id: "bridal-kanchipuram-ritual",
    filename: "image6.png",
    src: "/assets/images/image6.png",
    width: 1200,
    height: 1600,
    aspectRatio: 0.75,
    orientation: "portrait",
    category: "wedding",
    title: "Bridal Preparation & Floral Garland",
    description: "South Indian bride in crimson Kanchipuram silk adjusting temple earring before floral wall.",
    alt: "South Indian bride adjusting gold earring in red silk saree by RK Visual Photography",
    location: "Chennai / Madurai, Tamil Nadu",
    tags: ["bridal", "wedding", "kanchipuram", "temple jewelry", "rituals"],
  },

  "bullet-sunset-ride": {
    id: "bullet-sunset-ride",
    filename: "image7.png",
    src: "/assets/images/image7.png",
    width: 1280,
    height: 853,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "couple/pre-wedding",
    title: "Sunset Royal Enfield Highway Journey",
    description: "Joyful pre-wedding couple riding a classic Royal Enfield Bullet at sunset on the highway.",
    alt: "Pre-wedding couple on Royal Enfield bullet motorcycle at sunset by RK Visual",
    location: "Tamil Nadu Highways",
    tags: ["pre-wedding", "royal enfield", "motorcycle", "sunset", "lifestyle"],
  },

  "stage-proposal-chandelier": {
    id: "stage-proposal-chandelier",
    filename: "image8.png",
    src: "/assets/images/image8.png",
    width: 1600,
    height: 1066,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "wedding",
    title: "Chandelier Stage Reverence & Proposal",
    description: "Groom on one knee kissing bride's hand on luxury stage beneath glowing crystal chandelier.",
    alt: "Luxury wedding reception stage proposal under chandelier by RK Visual Photography",
    location: "Grand Convention Center, Tamil Nadu",
    tags: ["luxury wedding", "reception", "proposal", "chandelier", "lehenga"],
  },

  "windy-beach-crimson-gown": {
    id: "windy-beach-crimson-gown",
    filename: "image9.png",
    src: "/assets/images/image9.png",
    width: 1600,
    height: 1066,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "couple/pre-wedding",
    title: "Cinematic Coastal Crimson Gown",
    description: "Sunset beach portrait with sweeping crimson gown billowing in the sea breeze.",
    alt: "Pre-wedding beach portrait with billowing red gown at sunset by RK Visual Photography",
    location: "Mahabalipuram Shore, Tamil Nadu",
    tags: ["beach", "pre-wedding", "crimson gown", "sunset", "cinematic"],
  },

  "lake-boat-heritage-ride": {
    id: "lake-boat-heritage-ride",
    filename: "image10.png",
    src: "/assets/images/image10.png",
    width: 1280,
    height: 853,
    aspectRatio: 1.5,
    orientation: "landscape",
    category: "couple/pre-wedding",
    title: "Serene Lake Boat Ride & Heritage Couple",
    description: "Peaceful couple embrace on a traditional wooden boat steered by an elder boatman.",
    alt: "Couple on traditional boat on lake with boatman by RK Visual Photography",
    location: "South Indian Backwaters, Tamil Nadu",
    tags: ["heritage", "lake", "boat ride", "pre-wedding", "culture"],
  },
};

// ==============================================================================
// 2. LOGICAL CONTENT GROUPINGS
// ==============================================================================
export const STUDIO_COLLECTIONS = {
  weddings: [
    STUDIO_INVENTORY["stage-proposal-chandelier"],
    STUDIO_INVENTORY["bridal-kanchipuram-ritual"],
    STUDIO_INVENTORY["reception-couple-night"],
  ],
  preWedding: [
    STUDIO_INVENTORY["hero-sunset-silhouette"],
    STUDIO_INVENTORY["windy-beach-crimson-gown"],
    STUDIO_INVENTORY["bullet-sunset-ride"],
    STUDIO_INVENTORY["lake-boat-heritage-ride"],
  ],
  portraits: [
    STUDIO_INVENTORY["heritage-temple-jewelry"],
    STUDIO_INVENTORY["bridal-kanchipuram-ritual"],
    STUDIO_INVENTORY["baby-velvet-twilight"],
  ],
  events: [
    STUDIO_INVENTORY["stage-proposal-chandelier"],
    STUDIO_INVENTORY["reception-couple-night"],
    STUDIO_INVENTORY["heritage-temple-jewelry"],
  ],
  studioCraft: [
    STUDIO_INVENTORY["bridal-kanchipuram-ritual"],
    STUDIO_INVENTORY["heritage-temple-jewelry"],
    STUDIO_INVENTORY["hero-sunset-silhouette"],
  ],
  heroCandidates: [
    STUDIO_INVENTORY["hero-sunset-silhouette"],
    STUDIO_INVENTORY["stage-proposal-chandelier"],
    STUDIO_INVENTORY["windy-beach-crimson-gown"],
    STUDIO_INVENTORY["lake-boat-heritage-ride"],
  ],
  kidsAndFamily: [
    STUDIO_INVENTORY["kids-car-portrait"],
    STUDIO_INVENTORY["kids-tricycle-smile"],
    STUDIO_INVENTORY["baby-velvet-twilight"],
  ],
  detailShots: [
    STUDIO_INVENTORY["bridal-kanchipuram-ritual"],
    STUDIO_INVENTORY["heritage-temple-jewelry"],
    STUDIO_INVENTORY["stage-proposal-chandelier"],
  ],
};

// ==============================================================================
// 3. CENTRALIZED SECTION ASSIGNMENTS
// Modify here to reassign images across the entire website instantly.
// ==============================================================================
export const SECTION_ASSETS = {
  hero: {
    lead: STUDIO_INVENTORY["hero-sunset-silhouette"],
    ambientLayer1: STUDIO_INVENTORY["windy-beach-crimson-gown"],
    ambientLayer2: STUDIO_INVENTORY["lake-boat-heritage-ride"],
  },

  rkMask: {
    monogramPhoto: STUDIO_INVENTORY["stage-proposal-chandelier"],
    title: "Royal Chettinad Stage Reverence",
    location: "Tamil Nadu, India",
    altText: "RK Monogram Mask aperture framing luxury wedding proposal",
  },

  featuredWorkFallback: [
    STUDIO_INVENTORY["stage-proposal-chandelier"],
    STUDIO_INVENTORY["windy-beach-crimson-gown"],
    STUDIO_INVENTORY["lake-boat-heritage-ride"],
    STUDIO_INVENTORY["bullet-sunset-ride"],
  ],

  services: {
    weddings: STUDIO_INVENTORY["stage-proposal-chandelier"],
    preWedding: STUDIO_INVENTORY["windy-beach-crimson-gown"],
    portraits: STUDIO_INVENTORY["bridal-kanchipuram-ritual"],
    filmsAndEvents: STUDIO_INVENTORY["lake-boat-heritage-ride"],
  },

  about: {
    leadArtist: STUDIO_INVENTORY["bridal-kanchipuram-ritual"],
    craftProof: STUDIO_INVENTORY["heritage-temple-jewelry"],
    pillars: [
      STUDIO_INVENTORY["hero-sunset-silhouette"],
      STUDIO_INVENTORY["stage-proposal-chandelier"],
      STUDIO_INVENTORY["lake-boat-heritage-ride"],
      STUDIO_INVENTORY["bullet-sunset-ride"],
    ],
  },

  socialSectionFallback: [
    STUDIO_INVENTORY["bullet-sunset-ride"],
    STUDIO_INVENTORY["windy-beach-crimson-gown"],
    STUDIO_INVENTORY["stage-proposal-chandelier"],
    STUDIO_INVENTORY["reception-couple-night"],
    STUDIO_INVENTORY["kids-car-portrait"],
  ],

  cta: {
    background: STUDIO_INVENTORY["hero-sunset-silhouette"],
  },
};

// ==============================================================================
// 4. HELPER UTILITIES
// ==============================================================================
export function getStudioImage(id: string): StudioImage {
  return STUDIO_INVENTORY[id] || STUDIO_INVENTORY["hero-sunset-silhouette"];
}

export function getHeroAsset(): StudioImage {
  return SECTION_ASSETS.hero.lead;
}

export function getMaskAsset(): {
  imageUrl: string;
  title: string;
  location: string;
  altText: string;
} {
  const asset = SECTION_ASSETS.rkMask.monogramPhoto;
  return {
    imageUrl: asset.src,
    title: SECTION_ASSETS.rkMask.title,
    location: SECTION_ASSETS.rkMask.location,
    altText: SECTION_ASSETS.rkMask.altText,
  };
}

export function getAboutLeadAsset(): StudioImage {
  return SECTION_ASSETS.about.leadArtist;
}
