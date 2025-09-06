import { AuthProvider } from "@/context/UserContext";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
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
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Slot />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
