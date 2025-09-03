import { useColorScheme } from "@/hooks/useColorScheme";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    CrimsonTextBold: require("../assets/fonts/CrimsonText-Bold.ttf"),
    CrimsonTextBoldItalic: require("../assets/fonts/CrimsonText-BoldItalic.ttf"),
    CrimsonTextItalic: require("../assets/fonts/CrimsonText-Italic.ttf"),
    CrimsonTextRegular: require("../assets/fonts/CrimsonText-Regular.ttf"),
    CrimsonTextSemiBold: require("../assets/fonts/CrimsonText-SemiBold.ttf"),
    CrimsonTextSemiBoldItalic: require("../assets/fonts/CrimsonText-SemiBoldItalic.ttf"),
    PlayFairItalic: require("../assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf"),
    PlayFairVariable: require("../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf"),
    InterDisplayLight: require("../assets/fonts/InterDisplay-Light.ttf"),
    InterDisplayRegular: require("../assets/fonts/InterDisplay-Regular.ttf"),
    InterDisplayMedium: require("../assets/fonts/InterDisplay-Medium.ttf"),
    InterDisplaySemiBold: require("../assets/fonts/InterDisplay-SemiBold.ttf"),
    InterDisplayExtraBold: require("../assets/fonts/InterDisplay-ExtraBold.ttf"),
    InterDisplayBold: require("../assets/fonts/InterDisplay-Bold.ttf"),
    InterDisplayBlack: require("../assets/fonts/InterDisplay-Black.ttf"),
    InterLight: require("../assets/fonts/Inter-Light.ttf"),
    InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    InterExtraBold: require("../assets/fonts/Inter-ExtraBold.ttf"),
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
    InterBlack: require("../assets/fonts/Inter-Black.ttf"),
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

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ClerkProvider>
  );
}
