-- ── photo_uploads table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.photo_uploads (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url  text        NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.photo_uploads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'photo_uploads'
      AND policyname = 'anon_insert'
  ) THEN
    CREATE POLICY anon_insert ON public.photo_uploads
      FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'photo_uploads'
      AND policyname = 'anon_select'
  ) THEN
    CREATE POLICY anon_select ON public.photo_uploads
      FOR SELECT TO anon USING (true);
  END IF;
END $$;

-- ── photos storage bucket ─────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ── Storage RLS policies ──────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'photos_anon_upload'
  ) THEN
    CREATE POLICY photos_anon_upload ON storage.objects
      FOR INSERT TO anon
      WITH CHECK (bucket_id = 'photos');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'photos_public_read'
  ) THEN
    CREATE POLICY photos_public_read ON storage.objects
      FOR SELECT TO public
      USING (bucket_id = 'photos');
  END IF;
END $$;
