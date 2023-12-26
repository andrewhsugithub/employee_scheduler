import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const DrawerProfile = () => {
  const auth = getAuth();
  const router = useRouter();
  const [expand, setExpand] = useState(false);
  const params = useLocalSearchParams();

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.clear();
    router.push("/(auth)/SignIn");
  };

  return (
    <View>
      <Pressable
        className="rounded-2xl bg-sky-200 p-3 m-2  "
        onPress={() => setExpand(!expand)}
      >
        <View
          className={`bg-sky-300 rounded-2xl flex ${!expand ? "" : "p-2"} `}
        >
          <Pressable className={`p-2 ${!expand ? "hidden" : ""}`}>
            <Text className="text-2xl">profile</Text>
          </Pressable>
          <Pressable
            className={`p-2 ${!expand ? "hidden" : ""}`}
            onPress={handleLogout}
          >
            <Text className="text-2xl">Logout</Text>
          </Pressable>
        </View>
        <Text className="text-2xl p-2">{params.employee_id}</Text>
      </Pressable>
    </View>
  );
};

export default DrawerProfile;
