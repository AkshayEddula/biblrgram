import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

export default function Onboarding() {
  const router = useRouter();
  useWarmUpBrowser();

  const { startSSO } = useSSO();

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google SSO flow...");

      // Start the authentication process by calling `startSSO()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSO({
        strategy: "oauth_google",
        // For native, you must pass a scheme using AuthSession.makeRedirectUri()
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "biblegram",
          path: "/oauth-callback",
        }),
      });

      console.log("SSO flow result:", {
        createdSessionId,
        signInStatus: signIn?.status,
        signUpStatus: signUp?.status,
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log("Session created successfully:", createdSessionId);
        setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      } else {
        // If there is no `createdSessionId`, there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSO` to handle next steps
        if (signIn && signIn.status === "complete") {
          setActive!({ session: signIn.createdSessionId });
          router.replace("/(tabs)");
        } else if (signUp && signUp.status === "complete") {
          setActive!({ session: signUp.createdSessionId });
          router.replace("/(tabs)");
        } else {
          console.log("Additional steps required:", { signIn, signUp });
          Alert.alert(
            "Authentication Incomplete",
            "Additional verification may be required. Please try again."
          );
        }
      }
    } catch (err) {
      console.error("SSO error details:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        `Failed to sign in with Google: ${err.message || "Unknown error"}`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Your existing beautiful gradient background */}
      <LinearGradient
        colors={["#0F172A", "#1E293B", "#3730A3", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      />

      {/* Content Container */}
      <View className="absolute inset-0 flex-1 px-5 py-16 pb-8">
        {/* Your existing content - logo, title, features */}
        <View className="flex-1 items-start justify-start">
          {/* App Icon */}
          <View className="mb-8">
            <View className="bg-white rounded-[24px]">
              <Image
                source={require("../../assets/images/logo.png")}
                width="64"
                height="64"
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

        {/* Bottom Actions - UPDATED BUTTON */}
        <View className="space-y-4 mb-2">
          <TouchableOpacity className="w-full" onPress={handleGoogleSignIn}>
            <View className="bg-white py-6 rounded-[18px] flex-row items-center justify-center shadow-lg">
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text className="text-gray-800 text-[16px] font-GilroyMedium ml-3">
                Sign in with Google
              </Text>
            </View>
          </TouchableOpacity>

          {/* Terms */}
          <Text className="text-white/50 text-xs font-GilroyRegular text-center px-8 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
