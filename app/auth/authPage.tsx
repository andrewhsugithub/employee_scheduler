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
    const user = await new Promise((res) => setTimeout(res, 5000)); // simulate sign in process 5 seconds
    if (user === null) return;
    setAuthLoader(false);
    // router.push(`/crew/${user.id}`);
    router.push(`/${Math.random() * 1000}/home`);
  };

  return (
    <SafeAreaView className="flex items-center justify-center">
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Text>Sign In/Up Form</Text>
      <Text>Your role:</Text>
      <Text>我想用成手機綁定個人帳號</Text>
      <Pressable onPress={signIn} className=" bg-green-500 p-4">
        {authLoader ? (
          <ActivityIndicator size="large" className="text-gray-400" />
        ) : (
          <Text>Sign In/Up</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

export default Auth;
