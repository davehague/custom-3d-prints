import { createClient } from "@supabase/supabase-js";

// The key is safe to use in a browser if you have enabled Row Level Security 
// for your tables and configured policies. 
// (via https://supabase.com/dashboard/project/gdyjsqmpybjcsrevmlmq/settings/api)
const supabaseUrl = 'your-supabase-url'
const supabaseKey = 'your-supabase-key'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "timeline" },
});