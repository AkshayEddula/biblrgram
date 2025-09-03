import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    PlayFairItalic: require("../assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf"),
    PlayFairVariable: require("../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf"),
    GilroyThin: require("../assets/fonts/Gilroy-Thin.ttf"),
    GilroyUltraLight: require("../assets/fonts/Gilroy-UltraLight.ttf"),
    GilroyLight: require("../assets/fonts/Gilroy-Light.ttf"),
    GilroyRegular: require("../assets/fonts/Gilroy-Regular.ttf"),
    GilroyMedium: require("../assets/fonts/Gilroy-Medium.ttf"),
    GilroySemiBold: require("../assets/fonts/Gilroy-SemiBold.ttf"),
    GilroyBold: require("../assets/fonts/Gilroy-Bold.ttf"),
    GilroyExtraBold: require("../assets/fonts/Gilroy-ExtraBold.ttf"),
    GilroyHeavy: require("../assets/fonts/Gilroy-Heavy.ttf"),
    GilroyBlack: require("../assets/fonts/Gilroy-Black.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
