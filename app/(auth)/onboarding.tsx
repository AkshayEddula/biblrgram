import { Ionicons } from "@expo/vector-icons";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

// Complete the auth session

export default function Onboarding() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log(response.data);
        setUserInfo(response.data);
      } else {
        console.log("sign in was cancelled by user");
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            Alert.alert("Sign in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            Alert.alert("Play services not available");
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
        Alert.alert("An error occurred");
      }
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
