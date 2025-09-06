import { useAuth } from "@/context/UserContext";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { user, loading, isOnboarded } = useAuth();

  if (loading) {
    // You can return a loading component here if needed
    return null;
  }

  if (user && isOnboarded) {
    // User is already authenticated, redirect to main app
    return <Redirect href="/(app)/(tabs)/home" />;
  } else if (!isOnboarded) {
    return <Redirect href="/(auth)/step1" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="step1"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
