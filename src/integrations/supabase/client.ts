import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://umynkzzwmljmmzjceuze.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteW5renp3bWxqbW16amNldXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDQwNDEsImV4cCI6MjA4MjU4MDA0MX0.qsisQhk85EnW6HUIM8R1PGXbK99Sb966fe_Peb4fbwY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
