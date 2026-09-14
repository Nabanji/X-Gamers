import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/clerk-expo";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Use inside components/screens — attaches a fresh Clerk token to every request.
export function useSupabaseClient() {
  const { session } = useSession();

  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return session?.getToken() ?? null;
    },
  });
}

// For public/unauthenticated reads only — no Clerk token attached.
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);