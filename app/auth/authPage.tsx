import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
const Auth = () => {
  const [authLoader, setAuthLoader] = useState(false);
  const router = useRouter();

  // sign in process here
  const signIn = async () => {
    setAuthLoader(true);
    const user = await new Promise((res) => setTimeout(res, 2000)); // simulate sign in process 2 seconds
    if (user === null) return;
    setAuthLoader(false);
    // router.push(`/crew/${user.id}`);
    router.push(`/${Math.random() * 1000}/home`);
  };

  return (
    <SafeAreaView className="flex items-center justify-center">
      {/* <LinearGradient
        className="h-screen"
        colors={[
          "rgba(135,206,235,1.0)",
          "rgba(100,145,180,1.0)",
          //"rgba(50,70,255,1.0)",
        ]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
      > */}
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Text className="text-2xl text-black font-extrabold">
        Sign In/Up Form
      </Text>

      <Text>Your role:</Text>
      <Text>我想用成手機綁定個人帳號</Text>
      <Pressable onPress={signIn} className=" bg-green-500 p-4">
        {authLoader ? (
          <ActivityIndicator size="large" className="text-gray-400" />
        ) : (
          <Text>Sign In/Up</Text>
        )}
      </Pressable>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

export default Auth;
