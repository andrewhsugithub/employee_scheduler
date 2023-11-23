import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { Pressable, SafeAreaView, View, useColorScheme } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "(auth)",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    // <Stack screenOptions={{ headerShown: false }} />
    <>
      <LinearGradient
        className="h-screen relative"
        colors={[
          "rgba(58,131,244,0.4)",
          "rgba(9,181,211,0.4)",
          //"rgba(50,70,255,1.0)",
        ]}
        //start={{ x: 0.0, y: 0.0 }}
        //end={{ x: 0.0, y: 1.0 }}
      >
        <AntDesign
          name="caretleft"
          size={30}
          color="black"
          onPress={() => router.back()}
          className="absolute top-5 left-5"
        />
        <Slot />
      </LinearGradient>
    </>
    // </ThemeProvider>
  );
}
