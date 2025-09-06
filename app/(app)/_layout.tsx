import { useAuth } from "@/context/UserContext";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a loading component here if needed
    return null;
  }

  if (!user) {
    // User is not authenticated, redirect to auth
    return <Redirect href="/(auth)/sign-in" />;
  }

  // User is authenticated, show the main app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
