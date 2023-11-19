import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Link,
  Tabs,
  useGlobalSearchParams,
  useLocalSearchParams,
  Stack,
} from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function StackLayout() {
  const params = useLocalSearchParams();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack />
    </>
  );
}
