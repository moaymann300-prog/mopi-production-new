
-- Check all settings rows
SELECT id, key, label, group_name, LEFT(value,40) as value_preview 
FROM cms_site_settings_2026_04_21 
ORDER BY group_name, id;
