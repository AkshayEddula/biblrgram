import { useAuth } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

GoogleSignin.configure({
  webClientId:
    "727029929883-2v3vbhrj0o86q5nsqfuskfnt2942pj78.apps.googleusercontent.com",
});

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (!authLoading && user) {
      console.log("User already authenticated, redirecting...");
      router.replace("/home"); // Uncomment when home is ready
    }
  }, [user, authLoading]);

  const handleGoogleSignIn = async () => {
    console.log("Google Sign-in button pressed");
    setLoading(true);

    try {
      // Step 1: Sign in with Google
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { data } = response;
        console.log("Google sign in successful:", data.user.email);

        // Step 2: Authenticate with Supabase using Google ID token
        const { data: authData, error: authError } =
          await supabase.auth.signInWithIdToken({
            provider: "google",
            token: data.idToken!,
          });

        if (authError) {
          console.error("Supabase authentication failed:", authError);
          Alert.alert("Authentication Error", authError.message);
          return;
        }

        console.log(
          "Supabase authentication successful:",
          authData.user?.email
        );

        // The user profile will be automatically created by the database trigger
        // The AuthContext will handle session management
        Alert.alert("Success!", "Welcome to Bible Gram!");

        // Navigation will be handled by the useEffect above
      } else {
        console.log("Google sign in was cancelled");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      Alert.alert("Sign In Error", error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#0F172A", "#1E293B", "#3730A3", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      />

      <View className="absolute inset-0 flex-1 px-5 py-16 pb-8">
        <View className="flex-1 items-start justify-start">
          {/* App Icon */}
          <View className="mb-8">
            <View className="bg-white rounded-[24px]">
              <Image
                source={require("../../assets/images/logo.png")}
                width={64}
                height={64}
                className="w-48 h-48"
              />
            </View>
          </View>

          {/* Title */}
          <View className="mb-3">
            <Text className="text-[32px] font-PlayFairItalic text-white ">
              Experience God's Word
            </Text>
            <Text className="text-[32px] font-PlayFairItalic text-yellow-400 ">
              Like Never Before
            </Text>
          </View>

          {/* Subtitle */}
          <View className="mb-8">
            <Text className="text-[16px] font-GilroyMedium text-white/80  leading-relaxed">
              Swipe through beautiful Bible verses and stories crafted just for
              you
            </Text>
          </View>

          {/* App Features Card */}
          <View className="w-full mb-8">
            <View>
              <View className="flex-row items-center bg-white/20 mb-3 p-4 rounded-[16px]">
                <View className="w-8 h-8 bg-blue-400/20 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="play-circle" size={16} color="#60A5FA" />
                </View>
                <Text className="text-white text-[13px] font-GilroyMedium flex-1">
                  Beautiful Bible verse reels you can swipe through
                </Text>
              </View>
              <View className="flex-row items-center bg-white/20 mb-3 p-4 rounded-[16px]">
                <View className="w-8 h-8 bg-purple-400/20 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="heart" size={16} color="#A78BFA" />
                </View>
                <Text className="text-white text-[13px] font-GilroyMedium flex-1">
                  Personalized content based on your spiritual journey
                </Text>
              </View>
              <View className="flex-row items-center bg-white/20 p-4 rounded-[16px]">
                <View className="w-8 h-8 bg-green-400/20 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="bookmark" size={16} color="#34D399" />
                </View>
                <Text className="text-white text-[13px] font-GilroyMedium flex-1">
                  Save your favorite verses and share with friends
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign In Button */}
        <View className="space-y-4 mb-2">
          <TouchableOpacity
            className="w-full"
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <View
              className={`bg-white py-6 rounded-[18px] flex-row items-center justify-center shadow-lg ${loading ? "opacity-70" : ""}`}
            >
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text className="text-gray-800 text-[16px] font-GilroyMedium ml-3">
                {loading ? "Signing in..." : "Sign in with Google"}
              </Text>
            </View>
          </TouchableOpacity>

          <Text className="text-white/50 text-xs font-GilroyRegular text-center px-8 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
