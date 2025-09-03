import { useSession } from '@clerk/clerk-expo'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jwobravxzcadpkrbtmnn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3b2JyYXZ4emNhZHBrcmJ0bW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTkyNjIsImV4cCI6MjA3MjE5NTI2Mn0.MtA4TTCr04926p1wgdcfIQWM0ZmqlCpcm-20Kx4jll8"

export function useSupabaseClient() {
    const { session } = useSession()

    const getSupabaseClient = () => {
        return createClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                global: {
                    headers: {
                        'apikey': supabaseAnonKey, // Add this line!
                    },
                },
                auth: {
                    // Pass Clerk token as custom access token
                    getAccessToken: async () => {
                        return await session?.getToken() || null
                    },
                },
            }
        )
    }

    return getSupabaseClient
}