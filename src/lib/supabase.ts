import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://ijcnlerixukiymlcxnmj.supabase.co";

export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseKey.trim().length > 10 &&
    !supabaseKey.includes("YOUR_")
  );
};

export const supabase = createClient(
  supabaseUrl,
  supabaseKey || "dummy-anon-key-placeholder"
);
