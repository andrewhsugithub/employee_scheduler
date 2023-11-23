import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
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
          name="home"
          options={{
            title: "Home",
            headerRight: () => (
              <Link href={`/${params.employee_id}/home`} asChild>
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
          name="profile"
          options={{
            title: "Profile",
            headerRight: () => (
              <Link href={`/${params.employee_id}/profile`} asChild>
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
          name="verify"
          options={{
            title: "Verify",
            headerRight: () => (
              <Link href={`/${params.employee_id}/verify`} asChild>
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
