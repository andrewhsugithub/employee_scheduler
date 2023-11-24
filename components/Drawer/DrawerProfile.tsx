﻿import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const DrawerProfile = () => {
  const [expand, setExpand] = useState(false);
  const params = useLocalSearchParams();

  return (
    <View>
      <View></View>
      <Pressable
        className="rounded-2xl bg-sky-200 p-3 m-2"
        onPress={() => setExpand(!expand)}
      >
        <View
          className={`bg-sky-300 rounded-2xl flex ${!expand ? "" : "p-2"} `}
        >
          <Pressable className={`p-2 ${!expand ? "hidden" : ""}`}>
            <Text className="text-2xl">Bla Bla Bla</Text>
          </Pressable>
          <Pressable className={`p-2 ${!expand ? "hidden" : ""}`}>
            <Text className="text-2xl">Logout</Text>
          </Pressable>
        </View>
        <Text className="text-2xl p-2">{params.employee_id}</Text>
      </Pressable>
    </View>
  );
};

export default DrawerProfile;
