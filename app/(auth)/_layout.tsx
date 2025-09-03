import { Stack } from "expo-router";

export default function AuthRoutesLayout() {
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
