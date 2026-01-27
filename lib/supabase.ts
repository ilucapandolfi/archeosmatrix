import { createClient } from '@supabase/supabase-js';

// Queste variabili verranno lette da Vercel (Environment Variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "ATTENZIONE: Supabase URL o Anon Key mancanti nelle variabili d'ambiente di Vercel. " +
    "Controlla i Settings del tuo progetto su Vercel."
  );
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);
