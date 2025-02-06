// server/utils/serverSupabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const serverSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "virtualcraftinnovations" },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});