import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ponytail: content still ships from data/*.ts. This client activates once NEXT_PUBLIC_SUPABASE_URL
// and NEXT_PUBLIC_SUPABASE_ANON_KEY are set and the reads in data/*.ts are swapped for Supabase queries.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
