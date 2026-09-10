-- ==============================================================================
-- RK Visual Photography — Seed Data for Social Channels & Featured Feed
-- ==============================================================================

-- 1. Seed Social Profile Channels
insert into public.social_links (id, platform, label, url, handle, is_active, order_index)
values
  ('c1000000-0000-0000-0000-000000000001', 'instagram', 'Instagram', 'https://www.instagram.com/rk_visual_photography/', '@rk_visual_photography', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'youtube', 'YouTube Cinema', 'https://www.youtube.com/@rkvisualphotography', '@rkvisualphotography', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'whatsapp', 'WhatsApp Concierge', 'https://wa.me/919876543210', '+91 98765 43210', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'facebook', 'Facebook', 'https://www.facebook.com/rkvisualphotography', 'RK Visual Photography', true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'google_business', 'Google Reviews', 'https://maps.google.com/?q=RK+Visual+Photography+Tamil+Nadu', '5.0 ★ Client Reviews', true, 5)
on conflict (platform) do update set
  label = excluded.label,
  url = excluded.url,
  handle = excluded.handle,
  is_active = excluded.is_active,
  order_index = excluded.order_index,
  updated_at = now();

-- 2. Seed User-Provided Social Posts (3 Instagram Reels + 2 YouTube Shorts)
insert into public.social_posts (id, platform, post_url, thumbnail_url, caption, is_featured, order_index)
values
  (
    'd1000000-0000-0000-0000-000000000001',
    'instagram',
    'https://www.instagram.com/reel/C8et_o8hNk1/',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    'Sacred Muhurtham Exchange & Royal Kanjivaram Heirlooms',
    true,
    1
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'instagram',
    'https://www.instagram.com/reel/DCZQ5h5OR1O/',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    'Twilight Temple Reflections & Heirloom Silk Portraits',
    true,
    2
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'instagram',
    'https://www.instagram.com/reel/DcLkIHbB_ig/',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    'Intimate Pre-Wedding Moments Under Ancient Banyan Canopies',
    true,
    3
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'youtube',
    'https://youtube.com/shorts/qwVldxJuVrU?si=02988bSeeasWySQS',
    'https://img.youtube.com/vi/qwVldxJuVrU/hqdefault.jpg',
    'Cinematic Wedding Teaser | 4K South Indian Muhurtham',
    true,
    4
  ),
  (
    'd1000000-0000-0000-0000-000000000005',
    'youtube',
    'https://youtube.com/shorts/FVTUbNG1EPc?si=0M91nnTHMomBsjkl',
    'https://img.youtube.com/vi/FVTUbNG1EPc/hqdefault.jpg',
    'Shore Temple Sunset Union | Mahabalipuram Cinema',
    true,
    5
  )
on conflict (id) do update set
  platform = excluded.platform,
  post_url = excluded.post_url,
  thumbnail_url = excluded.thumbnail_url,
  caption = excluded.caption,
  is_featured = excluded.is_featured,
  order_index = excluded.order_index;
