
-- Fix: use $$ quoting to avoid apostrophe issues
SELECT upsert_page_content('services','cta','label', $$Let's Get Started$$, 'لنبدأ معاً');
SELECT upsert_page_content('services','cta','heading', 'Ready to Start Your Project?', 'مستعد لبدء مشروعك؟');
SELECT upsert_page_content('services','cta','heading2', 'Your Project?', 'مشروعك؟');
SELECT upsert_page_content('services','cta','subtitle', $$Let's discuss your exhibition needs and create a custom solution that exceeds expectations.$$, 'دعنا نناقش احتياجات معرضك ونصنع لك حلاً مخصصاً يفوق التوقعات.');
SELECT upsert_page_content('services','cta','cta_primary', 'Free Consultation', 'استشارة مجانية');
