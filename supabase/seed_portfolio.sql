-- ==============================================================================
-- RK Visual Photography — Seed Data for Portfolio, Services, Testimonials, & Stories
-- ==============================================================================

-- 1. Insert Projects
insert into public.projects (
  id,
  title,
  slug,
  category_id,
  cover_image_url,
  location,
  event_date,
  description,
  story,
  featured,
  published,
  order_index,
  seo_title,
  seo_description
) values
(
  'a1000000-0000-0000-0000-000000000001',
  'Vikram & Deepa — Royal Chettinad Palace Wedding',
  'vikram-deepa-chettinad-palace',
  '93d43c53-1bac-495d-9b23-7a157d91319b',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
  'Karaikudi, Tamil Nadu',
  '2025-11-18',
  'A three-day traditional South Indian royal wedding amidst antique Burma teak pillars, brass lanterns, and silk kanjivaram heirlooms.',
  'Held at the ancestral Chidambara Vilas in Chettinad, Vikram and Deepa’s union was an ode to heritage. From the early morning Muhurtham bathed in gentle courtyard light to the regal evening reception, our editorial focus centered on raw familial intimacy, handwoven gold zari textures, and timeless heirloom moments.',
  true,
  true,
  1,
  'Vikram & Deepa | Royal Chettinad Wedding Photography by RK Visual',
  'Witness the timeless grandeur of Vikram & Deepa’s three-day royal Chettinad wedding documented by luxury wedding photographer RK Visual in Tamil Nadu.'
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Arun & Meera — Twilight Shore Temple Intimate Union',
  'arun-meera-mahabalipuram-shore',
  '93d43c53-1bac-495d-9b23-7a157d91319b',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
  'Mahabalipuram, Tamil Nadu',
  '2026-01-24',
  'Intimate coastal ceremony overlooking 8th-century monolithic stone temple ruins against the Bay of Bengal horizon.',
  'Arun and Meera envisioned a wedding stripped of spectacle and steeped in sacred intimacy. As the golden hour draped over the granite sea temples, we captured fleeting glances, ocean spray misting over jasmine garlands, and a candlelit beach dinner accompanied by live classical veena acoustics.',
  true,
  true,
  2,
  'Arun & Meera | Coastal Temple Wedding Photography by RK Visual',
  'An intimate seaside wedding in Mahabalipuram documented with fine-art editorial sensibility by RK Visual Photography.'
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Karthik & Ananya — Misty Nilgiri Tea Estate Pre-Wedding',
  'karthik-ananya-nilgiri-tea-estate',
  '98bb3a01-5367-4c2b-8ea7-c290b9ab3a1a',
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
  'Ooty & Kotagiri, Tamil Nadu',
  '2026-02-10',
  'Cinematic sunrise editorial session traversing mist-shrouded emerald slopes, vintage colonial verandas, and pine forests.',
  'Escaping the tropical plains, Karthik and Ananya spent two days with our studio wandering through rolling tea plantations at dawn. With natural diffused morning light and antique woolen shawls, we composed an honest, cinematic portrait series honoring quiet romance.',
  true,
  true,
  3,
  'Karthik & Ananya | Nilgiri Pre-Wedding Editorial Session | RK Visual',
  'Misty tea estate pre-wedding photoshoot in the Nilgiri hills of Tamil Nadu crafted by luxury studio RK Visual.'
),
(
  'a1000000-0000-0000-0000-000000000004',
  'Siddharth & Priya — Heritage Courtyard Muhurtham',
  'siddharth-priya-heritage-courtyard',
  '93d43c53-1bac-495d-9b23-7a157d91319b',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1600&auto=format&fit=crop',
  'Madurai, Tamil Nadu',
  '2025-12-05',
  'Sacred Vedic rituals illuminated by bronze oil vilakku lamps, nadaswaram echoes, and temple lotus mandapams.',
  'A classic Tamil Brahmin Vedic celebration in Madurai. The mandapam was crafted entirely of fragrant tuberose and temple lotuses. We documented the vibrant Oonjal swing ceremonies and the poignant moment of the Kanyadaanam with quiet reverence and dramatic natural contrasts.',
  false,
  true,
  4,
  'Siddharth & Priya | Traditional Madurai Wedding Photography',
  'Timeless traditional Tamil Brahmin wedding rituals documented in Madurai by RK Visual Photography.'
)
on conflict (id) do nothing;

-- 2. Insert Project Images for Galleries
insert into public.project_images (
  id,
  project_id,
  image_url,
  alt_text,
  caption,
  width,
  height,
  order_index,
  is_cover,
  is_featured
) values
-- Vikram & Deepa Gallery
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
  'Bride in crimson Kanjivaram silk sari adorned with antique temple gold jewelry',
  'Deepa preparing in the ancestral courtyard at dawn',
  1600,
  1067,
  1,
  true,
  true
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop',
  'Bridal editorial portrait showing delicate temple jewellery detail',
  'Intricate emerald and gold maang tikka reflections',
  1600,
  1200,
  2,
  false,
  true
),
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  'Couple exchanging garlands under floral mandap',
  'The sacred Muhurtham exchange at sunrise',
  1600,
  1067,
  3,
  false,
  false
),
(
  'b1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop',
  'Evening reception couple portrait under Chettinad palace colonnade',
  'Twilight stroll through the carved granite corridors',
  1600,
  1067,
  4,
  false,
  true
),
-- Arun & Meera Gallery
(
  'b1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
  'Arun and Meera against the golden hour ocean breeze in Mahabalipuram',
  'Sea mist and twilight warmth along the Bay of Bengal',
  1600,
  1067,
  1,
  true,
  true
),
(
  'b1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1600&auto=format&fit=crop',
  'Sacred fire homam rituals with flower petals',
  'Agni rituals accompanied by ancient chanting',
  1600,
  1067,
  2,
  false,
  false
),
(
  'b1000000-0000-0000-0000-000000000007',
  'a1000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop',
  'Candlelit dinner setup along the seashore',
  'Minimalist beach reception with soft amber lanterns',
  1600,
  1067,
  3,
  false,
  true
),
-- Karthik & Ananya Gallery
(
  'b1000000-0000-0000-0000-000000000008',
  'a1000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
  'Couple standing atop mist-covered Nilgiri tea hill slope',
  'Morning mist rising over Kotagiri tea estates',
  1600,
  1067,
  1,
  true,
  true
),
(
  'b1000000-0000-0000-0000-000000000009',
  'a1000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600&auto=format&fit=crop',
  'Candid walking shot through towering eucalyptus trees',
  'Deep into the pine trails of Ooty',
  1600,
  1067,
  2,
  false,
  false
)
on conflict (id) do nothing;

-- 3. Insert Services & Offerings
insert into public.services (
  id,
  title,
  slug,
  summary,
  description,
  cover_image_url,
  order_index,
  is_active,
  features
) values
(
  'c1000000-0000-0000-0000-000000000001',
  'Luxury Wedding Documentation',
  'luxury-wedding-documentation',
  'Multi-day comprehensive editorial coverage crafted with museum-grade artistic direction.',
  'Our signature wedding experience. Designed for couples seeking thoughtful, unobtrusive documentation of their celebrations. Includes pre-wedding conceptual meetings, multi-day coverage, lead artist direction, full-resolution heirloom archives, and handcrafted Italian leather albums.',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
  1,
  true,
  '["Lead photographer & dedicated cinematography crew", "Comprehensive multi-day coverage (Sangeet, Muhurtham, Reception)", "Hand-curated high-resolution digital master gallery", "Fine-art leather bound bespoke wedding heirloom album", "Drone aerial documentation where permitted", "Private online cloud delivery & print copyright"]'::jsonb
),
(
  'c1000000-0000-0000-0000-000000000002',
  'Pre-Wedding & Destination Sessions',
  'pre-wedding-destination-sessions',
  'Editorial romance stories staged in cinematic landscapes across South India and beyond.',
  'A relaxed, unhurried two-day destination session where we capture your authentic connection against dramatic architectural ruins, ocean cliffs, or high-altitude mountain forests. We assist with styling, timing the natural light, and mood direction.',
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  2,
  true,
  '["Two-day relaxed destination location shooting", "Creative wardrobe styling consultation", "High-density editorial portrait retouching", "Teaser preview delivered within 72 hours", "4K cinematic story reel for invitations"]'::jsonb
),
(
  'c1000000-0000-0000-0000-000000000003',
  'Fine-Art Editorial Portraits',
  'fine-art-editorial-portraits',
  'Intimate solo, maternity, and couple fine-art portraiture exploring chiaroscuro light.',
  'Commissioned studio or on-location portraiture celebrating life milestones. Drawing inspiration from classic oil paintings, our portraits focus on sculptural lighting, rich shadow depth, and timeless emotional stillness.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
  3,
  true,
  '["Studio chiaroscuro or environmental location", "Artistic lighting and pose direction", "Archival fine-art cotton rag prints included", "Personal online proofing gallery", "High-end bespoke skin & tone retouching"]'::jsonb
),
(
  'c1000000-0000-0000-0000-000000000004',
  'Cinematic Wedding Films',
  'cinematic-wedding-films',
  'Atmospheric motion portraits and documentary films cut to evocative original scores.',
  'Cinematography that mirrors the aesthetic of cinema. We focus on spoken family vows, ambient sacred temple sounds, and slow cinematic motion captured on cinema-grade cameras with vintage prime lenses.',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop',
  4,
  true,
  '["4K Ultra HD multi-camera cinema coverage", "High-fidelity binaural audio recording of rituals", "3 to 5-minute flagship cinematic highlight film", "Full-length ceremony & speeches feature archive", "Master color grading with filmic emulation"]'::jsonb
)
on conflict (id) do nothing;

-- 4. Insert Testimonials
insert into public.testimonials (
  id,
  client_name,
  partner_name,
  event_type,
  location,
  quote,
  rating,
  featured,
  published,
  order_index
) values
(
  'd1000000-0000-0000-0000-000000000001',
  'Deepa Sundaram',
  'Vikram R.',
  'Chettinad Palace Wedding',
  'Karaikudi, Tamil Nadu',
  'RK Visual captured our wedding not just as an event, but as a living heritage tale. Looking through our album brings tears every single time. Their ability to catch quiet glances amidst chaotic South Indian rituals is unmatched.',
  5,
  true,
  true,
  1
),
(
  'd1000000-0000-0000-0000-000000000002',
  'Meera Krishnan',
  'Arun V.',
  'Seaside Temple Wedding',
  'Mahabalipuram',
  'We did not want cheesy staged poses or artificial lighting. RK Visual gave us poetry in photographs. The natural golden hour light and raw emotion felt effortless. Absolute masters of fine-art photography.',
  5,
  true,
  true,
  2
),
(
  'd1000000-0000-0000-0000-000000000003',
  'Ananya Venkatesh',
  'Karthik S.',
  'Nilgiri Pre-Wedding Shoot',
  'Ooty',
  'Our pre-wedding shoot in the Nilgiris felt like a serene getaway. The team is warm, discerning, and exceptionally patient. The photos look like still frames from a classic European art film.',
  5,
  true,
  true,
  3
)
on conflict (id) do nothing;

-- 5. Insert Stories / Blog Posts
insert into public.blog_posts (
  id,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  tags,
  published,
  published_at
) values
(
  'e1000000-0000-0000-0000-000000000001',
  'The Art of Documenting South Indian Heritage Weddings',
  'the-art-of-documenting-south-indian-heritage-weddings',
  'Reflections on capturing sacred Vedic rituals, antique Kanjivaram silk weaves, and ancestral courtyards without disturbing sacred moments.',
  'South Indian weddings are a sensory tapestry of sacred antiquity. Between the resonating hum of the Nadaswaram, the fragrant scent of crushed jasmine, and the flicker of brass vilakkus, there is an unspoken rhythm that demands deep reverence from the photographer.

Rather than imposing artificial flash or disruptive posing during sacred rituals like the Kanyadaanam or the tying of the Thaali, our studio adopts an unobtrusive, documentary stance. We embrace available natural light filtering through traditional central open courtyards (Muttam) to sculpt authentic emotional portraits.

When documenting wedding heirlooms, we pay deliberate homage to generational treasures—from grandmother’s antique temple necklaces to the gold zari borders woven on vintage handlooms in Kanchipuram. These are not merely accessories; they are tactile vessels of heritage.',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
  array['Heritage', 'Weddings', 'Philosophy', 'Tamil Nadu'],
  true,
  '2026-01-15 10:00:00+00'
),
(
  'e1000000-0000-0000-0000-000000000002',
  'Chasing Golden Hour: Why Natural Light Defines Timeless Portraits',
  'chasing-golden-hour-why-natural-light-defines-timeless-portraits',
  'How directional morning and twilight sunlight creates the warmth, romance, and fine-art texture in our couples photography.',
  'Light is the primary brush with which photographic memories are painted. While modern digital sensors allow cameras to shoot in pitch darkness, nothing replicates the gentle, amber luminescence of the golden hour.

In Tamil Nadu, the thirty minutes immediately preceding sunset and following sunrise possess an ethereal clarity. The low sun angle creates elongated, flattering shadows that accentuate facial bone structure while enveloping subjects in a natural golden halo.

When shooting in diverse landscapes—be it the granite shore temples of Mahabalipuram or the high-altitude cloud cover of Kodaikanal—we plan every session around the sun’s exact arc. By balancing ambient sky tones with subtle negative fill, we create imagery that requires no ephemeral trendy filters, ensuring your portraits remain breathtaking fifty years from today.',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
  array['Technique', 'Portraits', 'Light', 'Editorial'],
  true,
  '2026-02-01 11:30:00+00'
)
on conflict (id) do nothing;

-- 6. Insert Chatbot Questions & Knowledge
insert into public.chatbot_questions (
  id,
  question,
  answer,
  order_index,
  is_active
) values
(
  'f1000000-0000-0000-0000-000000000001',
  'How far in advance should we reserve our wedding dates?',
  'Due to our dedicated focus on bespoke editorial curation, we accept a strictly limited number of weddings each season. Most couples secure their dates 6 to 12 months in advance, especially during the auspicious Muhurtham months (September through March).',
  1,
  true
),
(
  'f1000000-0000-0000-0000-000000000002',
  'Do you travel for destination weddings across India and internationally?',
  'Yes, absolutely. While our primary studio is based in Tamil Nadu, our team regularly travels throughout India (including Kerala, Goa, Rajasthan, Bangalore) and international destinations (Sri Lanka, Dubai, Southeast Asia). Travel and stay logistics are coordinated transparently.',
  2,
  true
),
(
  'f1000000-0000-0000-0000-000000000003',
  'What is the delivery timeline for our wedding gallery and albums?',
  'We provide a curated teaser gallery within 5 to 7 days post-wedding. Complete high-resolution master galleries are delivered in 6 to 8 weeks, with handcrafted Italian archival albums following selection within 4 weeks.',
  3,
  true
),
(
  'f1000000-0000-0000-0000-000000000004',
  'Can we customize our photography and cinematography package?',
  'Every wedding is unique. During our initial consultation, we tailor our coverage—from multi-day family ceremonies to intimate couple pre-wedding sessions and drone aerial cinema—to align precisely with your vision.',
  4,
  true
)
on conflict (id) do nothing;

-- 7. Insert Site Settings
insert into public.site_settings (
  id,
  key,
  value,
  description
) values
(
  '01000000-0000-0000-0000-000000000001',
  'general',
  '{
    "studio_name": "RK Visual Photography",
    "tagline": "Capturing Stories That Last Beyond the Moment",
    "phone": "+91 98765 43210",
    "whatsapp": "+91 98765 43210",
    "email": "inquiries@rkvisual.com",
    "address": "Chennai & Madurai, Tamil Nadu, India",
    "instagram_url": "https://instagram.com/rkvisual",
    "available_worldwide": true
  }'::jsonb,
  'General studio identity and contact information'
)
on conflict (id) do nothing;
