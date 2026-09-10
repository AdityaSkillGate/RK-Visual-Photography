-- ==============================================================================
-- RK Visual Photography - Phase 10 Chatbot Knowledge Base Seed
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.chatbot_categories (id, name, slug, description, order_index, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Wedding', 'wedding', 'Tamil & South Indian traditional celebrations, Muhurtham & ceremonies', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Pre-Wedding', 'pre-wedding', 'Couples portraiture, outdoor narratives & romantic editorial sessions', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Events', 'events', 'Receptions, engagements, sangeet & milestone celebrations', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Portraits', 'portraits', 'Bespoke bridal, family legacy & individual portraits', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Bookings', 'bookings', 'Reservations, advance notice, availability & process', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Locations', 'locations', 'Tamil Nadu, Chennai, Coimbatore, Madurai, pan-India & destinations', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'Delivery', 'delivery', 'Turnaround time, teaser timelines, high-res galleries & albums', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'General', 'general', 'Studio philosophy, style, equipment & cinematography', 8, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active;

-- 2. Insert / Update Questions & Answers
INSERT INTO public.chatbot_questions (id, category_id, question, answer, action_label, action_url, order_index, is_active)
VALUES
  -- 1. Services
  (
    'f1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000008',
    'What services do you offer?',
    'We specialize in luxury editorial wedding photography, cinematic 4K wedding films, pre-wedding conceptual stories, heirloom bridal portraiture, and handcrafted archival fine-art albums. We cover multi-day celebrations across Tamil Nadu and destination locations.',
    'Explore Services',
    '/services',
    1,
    true
  ),

  -- 2. Locations / Areas Covered
  (
    'f1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000006',
    'What areas do you cover?',
    'While our flagship studio is in Tamil Nadu—regularly documenting weddings in Chennai, Coimbatore, Madurai, Tiruchirappalli, and Salem—we travel extensively across India (Kerala, Bangalore, Goa, Udaipur) and international destinations (Sri Lanka, Dubai, Southeast Asia). Travel and logistics are planned seamlessly.',
    'Contact Studio',
    '/contact',
    2,
    true
  ),

  -- 3. How to enquire
  (
    'f1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000005',
    'How can I enquire or check date availability?',
    'You can submit your celebration details through our bespoke Inquiry Form on our website or connect directly with our studio concierge via WhatsApp at +91 98765 43210. We reply within 24 hours with availability and customized options.',
    'Send Inquiry',
    '/contact',
    3,
    true
  ),

  -- 4. Wedding films
  (
    'f1000000-0000-0000-0000-000000000007',
    'c1000000-0000-0000-0000-000000000001',
    'Do you provide wedding films and cinematography?',
    'Yes, our cinematography team produces cinematic wedding films with bespoke sound design, candid storytelling, high-fidelity audio of sacred vows, and licensed musical scores. We provide 3–5 minute highlight trailers, full ceremony documentary edits, and vertical social teasers.',
    'WhatsApp Concierge',
    'https://wa.me/919876543210',
    4,
    true
  ),

  -- 5. Advance booking
  (
    'f1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000005',
    'How far in advance should we reserve our wedding dates?',
    'Due to our dedicated focus on bespoke editorial curation, we accept a strictly limited number of weddings each season. Most couples secure their dates 6 to 12 months in advance, especially during the auspicious Muhurtham months (September through March).',
    'Check Date Availability',
    '/contact',
    5,
    true
  ),

  -- 6. Delivery timeline
  (
    'f1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000007',
    'What is the delivery timeline for our wedding gallery and albums?',
    'We provide a curated teaser gallery of 30–50 master frames within 5 to 7 days post-wedding. The complete high-resolution color-graded gallery is delivered in 6 to 8 weeks, with handcrafted Italian archival albums following selection within 4 weeks.',
    'View Sample Galleries',
    '/work',
    6,
    true
  ),

  -- 7. Custom packages
  (
    'f1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000005',
    'Can we customize our photography and cinematography package?',
    'Every celebration is distinct. During our initial consultation, we tailor our coverage—from multi-day family ceremonies to intimate couple pre-wedding sessions and drone aerial cinema—to align precisely with your personal vision and schedule.',
    'WhatsApp Concierge',
    'https://wa.me/919876543210',
    7,
    true
  ),

  -- 8. Pre-wedding styling & guidance
  (
    'f1000000-0000-0000-0000-000000000008',
    'c1000000-0000-0000-0000-000000000002',
    'Do you guide couples with styling and poses during pre-wedding sessions?',
    'Absolutely. We believe the finest photographs happen when you feel relaxed and completely authentic. We provide styling moodboards, location guidance, and gentle editorial direction so you never feel stiff or staged.',
    'View Pre-Wedding Stories',
    '/work',
    8,
    true
  ),

  -- 9. Early morning Muhurtham lighting
  (
    'f1000000-0000-0000-0000-000000000009',
    'c1000000-0000-0000-0000-000000000001',
    'How do you handle early morning Muhurtham and low-light mandapam ceremonies?',
    'Traditional Tamil and South Indian Muhurthams often take place in early dawn hours (Brahma Muhurtham). Our team utilizes high-end full-frame sensor cameras and discreet, color-balanced off-camera lighting that preserves the sacred ambiance without disrupting ceremonies.',
    'Explore Our Work',
    '/work',
    9,
    true
  ),

  -- 10. Data backup & archival
  (
    'f1000000-0000-0000-0000-000000000010',
    'c1000000-0000-0000-0000-000000000008',
    'How is our footage and imagery secured during and after the wedding?',
    'Data safety is paramount. All cameras shoot to dual simultaneous memory cards on-site. Footage is ingested that night to triple-redundant local SSDs and offsite cloud cold storage. We maintain an archival copy of your master raw frames for up to 10 years.',
    'Inquire Now',
    '/contact',
    10,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  question = EXCLUDED.question,
  answer = EXCLUDED.answer,
  action_label = EXCLUDED.action_label,
  action_url = EXCLUDED.action_url,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active,
  updated_at = now();
