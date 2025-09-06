import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserPreferences {
  preferred_bible_version: string;
  denomination: string;
  age_group: string;
  spiritual_interests: string[];
  life_stage: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isOnboarded: boolean;
  userPreferences: UserPreferences | null;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isOnboarded: false,
  userPreferences: null,
  signOut: async () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Helpers for AsyncStorage
const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`✅ AsyncStorage: Set ${key} = ${value}`);
  } catch (e) {
    console.error(`❌ Error setting ${key} in AsyncStorage:`, e);
  }
};

const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`📱 AsyncStorage: Get ${key} = ${value}`);
    return value;
  } catch (e) {
    console.error(`❌ Error getting ${key} from AsyncStorage:`, e);
    return null;
  }
};

const removeItems = async (keys: string[]) => {
  try {
    await AsyncStorage.multiRemove(keys);
    console.log(`🗑️ AsyncStorage: Removed ${keys.join(", ")}`);
  } catch (e) {
    console.error("❌ Error removing items from AsyncStorage:", e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);

  // Check onboarding status from AsyncStorage + database
  const checkOnboardingStatus = async (userId: string) => {
    console.log(`🔍 Checking onboarding status for user: ${userId}`);

    try {
      // Check AsyncStorage first
      const localOnboarded = await getItem("user_onboarded");
      const localPreferences = await getItem("user_preferences");

      console.log(`📱 Local onboarded: ${localOnboarded}`);
      console.log(
        `📱 Local preferences: ${localPreferences ? "exists" : "null"}`
      );

      // Verify with DB (database is source of truth)
      console.log(`🗄️ Checking database for onboarding status...`);
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          is_onboarded,
          user_preferences (
            preferred_bible_version,
            denomination,
            age_group,
            spiritual_interests,
            life_stage
          )
        `
        )
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user onboarding status:", error);
        // Set loading to false even on error
        setLoading(false);
        return;
      }

      console.log(`🗄️ Database response:`, data);

      const dbIsOnboarded = data?.is_onboarded || false;
      const dbPreferences = data?.user_preferences?.[0] || null;

      console.log(`🗄️ DB isOnboarded: ${dbIsOnboarded}`);
      console.log(`🗄️ DB preferences: ${dbPreferences ? "exists" : "null"}`);

      // Update state with database values (database is source of truth)
      setIsOnboarded(dbIsOnboarded);
      setUserPreferences(dbPreferences);

      console.log(`📊 Final state - isOnboarded: ${dbIsOnboarded}`);

      // Update AsyncStorage if different (don't await these to avoid blocking)
      if (dbIsOnboarded !== (localOnboarded === "true")) {
        console.log(`🔄 Updating local onboarded status to: ${dbIsOnboarded}`);
        setItem("user_onboarded", dbIsOnboarded.toString());
      }

      if (dbPreferences && JSON.stringify(dbPreferences) !== localPreferences) {
        console.log(`🔄 Updating local preferences`);
        setItem("user_preferences", JSON.stringify(dbPreferences));
      } else if (!dbPreferences && localPreferences) {
        // Clear local preferences if DB has none
        console.log(`🔄 Clearing local preferences`);
        await AsyncStorage.removeItem("user_preferences");
      }
    } catch (error) {
      console.error("❌ Error checking onboarding status:", error);
    } finally {
      // Always set loading to false
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      console.log(`🔄 Refreshing user data for: ${user.id}`);
      await checkOnboardingStatus(user.id);
    }
  };

  useEffect(() => {
    console.log(`🚀 AuthProvider: Initializing...`);

    // Initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(`🔐 Initial session:`, session ? "exists" : "null");
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log(`👤 User found: ${session.user.email}`);
        checkOnboardingStatus(session.user.id);
      } else {
        console.log(`👤 No user found`);
        setLoading(false);
      }
    });

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔄 Auth event: ${event}`);

      // Don't process INITIAL_SESSION twice
      if (event === "INITIAL_SESSION") {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        console.log(`✅ User signed in: ${session.user.email}`);
        await checkOnboardingStatus(session.user.id);
      } else if (event === "SIGNED_OUT") {
        console.log(`👋 User signed out`);

        // Clear onboarding data
        setIsOnboarded(false);
        setUserPreferences(null);
        setLoading(false);
        await removeItems(["user_onboarded", "user_preferences"]);

        try {
          await GoogleSignin.signOut();
        } catch (error) {
          console.log("Google signout error:", error);
        }
      } else if (event === "TOKEN_REFRESHED") {
        console.log("🔄 Token refreshed");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Debug effect to log state changes
  useEffect(() => {
    console.log(`📊 AUTH STATE UPDATE:`);
    console.log(`  - loading: ${loading}`);
    console.log(`  - user: ${user ? user.email : "null"}`);
    console.log(`  - isOnboarded: ${isOnboarded}`);
    console.log(`  - userPreferences: ${userPreferences ? "exists" : "null"}`);
  }, [loading, user, isOnboarded, userPreferences]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signout error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isOnboarded,
    userPreferences,
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
