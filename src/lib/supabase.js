import { createClient } from '@supabase/supabase-js'

// Vercel's Supabase integration provides NEXT_PUBLIC_ prefixed vars.
// Vite exposes VITE_ prefixed vars to the client. We check both.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
