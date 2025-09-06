import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = 'https://jwobravxzcadpkrbtmnn.supabase.co' // Get from Supabase dashboard -> Settings -> API
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3b2JyYXZ4emNhZHBrcmJ0bW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTkyNjIsImV4cCI6MjA3MjE5NTI2Mn0.MtA4TTCr04926p1wgdcfIQWM0ZmqlCpcm-20Kx4jll8' // Get from Supabase dashboard -> Settings -> API


// SecureStore adapter for Supabase Auth
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key)
    },
    setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, value)
    },
    removeItem: (key: string) => {
        SecureStore.deleteItemAsync(key)
    },
}



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})