import { createClient } from "@supabase/supabase-js";

function readRequired(name) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : "";
}

export function getSupabaseServerClient() {
  const url = readRequired("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = readRequired("SUPABASE_SERVICE_ROLE_KEY");
  const anon = readRequired("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const key = serviceRole || anon;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export function isSupabaseConfigured() {
  return Boolean(
    readRequired("NEXT_PUBLIC_SUPABASE_URL") &&
      (readRequired("SUPABASE_SERVICE_ROLE_KEY") || readRequired("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
  );
}

