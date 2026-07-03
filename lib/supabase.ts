import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente público para ser usado no navegador (respeita as regras de RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente administrador (Service Role) para ser usado APENAS no servidor
// Esse cliente ignora as regras de RLS e tem acesso total de escrita/leitura.
export const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL at runtime');
  }
  if (!supabaseServiceKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY at runtime');
  }
  return createClient(url, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
