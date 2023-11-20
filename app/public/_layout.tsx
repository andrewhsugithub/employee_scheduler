import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useLocalSearchParams, Stack } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function TabLayout() {
  const params = useLocalSearchParams();

  return (
    <>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="registerForm"
          options={{
            title: "Register",
            headerRight: () => (
              <Link href={`/public/registerForm`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="ScanTrip"
          options={{
            title: "Scan",
            headerRight: () => (
              <Link href={`/public/ScanTrip`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
