-- ==============================================================================
-- Phase 11: Inquiry Management Enhancements
-- Adds preferred_service and is_archived columns to inquiries table
-- ==============================================================================

ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS preferred_service TEXT,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- Create index for fast pipeline filtering by status and archive state
CREATE INDEX IF NOT EXISTS idx_inquiries_pipeline 
  ON public.inquiries (is_archived, status, created_at DESC);
