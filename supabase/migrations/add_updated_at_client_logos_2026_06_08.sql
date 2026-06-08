
-- Add updated_at to cms_client_logos if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_client_logos_2026_06_08'
      AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.cms_client_logos_2026_06_08
      ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

-- Ensure the existing placeholder data is updated to have correct sort_order values
UPDATE public.cms_client_logos_2026_06_08
SET sort_order = id
WHERE sort_order IS NULL OR sort_order = 0;
