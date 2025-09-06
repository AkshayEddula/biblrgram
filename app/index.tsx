// Put this in your app/index.tsx or wherever you handle routing
import { useAuth } from "@/context/UserContext";
import { Redirect } from "expo-router";
import { View, Text } from "react-native";

export default function Index() {
  const { user, loading, isOnboarded } = useAuth();

  console.log(`🎯 NAVIGATION DEBUG:`);
  console.log(`  - loading: ${loading}`);
  console.log(`  - user: ${user ? user.email : "null"}`);
  console.log(`  - isOnboarded: ${isOnboarded}`);

  // Show loading state
  if (loading) {
    console.log(`⏳ Showing loading screen`);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // No user - go to auth
  if (!user) {
    console.log(`🔐 No user - redirecting to auth`);
    return <Redirect href="/(auth)/sign-in" />;
  }

  // User exists but not onboarded
  if (!isOnboarded) {
    console.log(`📝 User not onboarded - redirecting to onboarding`);
    return <Redirect href="/onboarding" />;
  }

  // User exists and is onboarded
  console.log(`🏠 User onboarded - redirecting to main app`);
  return <Redirect href="/(app)/(tabs)" />;
}
