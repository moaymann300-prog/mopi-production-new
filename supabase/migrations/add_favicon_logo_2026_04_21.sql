-- Add favicon entry to cms_logos table if it doesn't exist
INSERT INTO cms_logos_2026_04_21 (name, placement, url, alt_text, is_active)
SELECT 'Favicon', 'favicon', '/images/mopi_logo_20260101_112924.png', 'MOPi Production Favicon', true
WHERE NOT EXISTS (
  SELECT 1 FROM cms_logos_2026_04_21 WHERE placement = 'favicon'
);