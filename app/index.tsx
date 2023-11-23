import { useRouter } from "expo-router";
import { SafeAreaView, Text, Pressable } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
const ChooseRoleScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="h-screen flex flex-row justify-evenly items-center">
      <Stack.Screen options={{ headerShown: false }} />

      <Pressable
        className="bg-blue-400 w-2/5 rounded-2xl py-32"
        onPress={() => router.push(`/auth/authPage`)}
      >
        <Text className="font-black uppercase text-2xl text-center">
          Personal
        </Text>
      </Pressable>
      <Pressable
        className="bg-red-500 w-2/5 rounded-2xl py-32"
        onPress={() => router.push("/public/registerForm")}
      >
        <Text className="font-black uppercase text-2xl text-center">
          Public
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ChooseRoleScreen;
