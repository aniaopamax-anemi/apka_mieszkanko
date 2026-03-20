import { createClient } from '@supabase/supabase-js';

// process.env to nasz "most" do pliku z kluczami (np. .env.local)
// Wykrzyknik na końcu to informacja dla kodu: "Obiecuję, że ten klucz tam jest!"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);