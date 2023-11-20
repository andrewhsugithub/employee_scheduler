import QRCodeGenerator from "../../components/QRCodeGenerator";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";

const RollCall = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [countPeople, setCountPeople] = useState(0);

  return (
    <SafeAreaView>
      {/* <Stack.Screen /> */}
      <Text>Roll Call</Text>
      <Text>Hello crew of {params.trip_id}</Text>
      <Text>QR Code:</Text>
      <QRCodeGenerator id={Math.random() * 10000 + ""} />
      <Text>Verification Code</Text>
      <View className="flex items-center justify-center">
        <Text className="text-blue-300">
          simulate people signing in if more than 10 people then means all
          present
        </Text>
        {countPeople >= 10 ? (
          <Pressable
            onPress={() => {
              router.push(`/${params.trip_id}/schedule`);
            }}
            className="bg-red-300 px-7 rounded-xl py-2"
          >
            <Text>See Job Schedule</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setCountPeople((countPeople) => countPeople + 1);
            }}
            className="bg-blue-300 px-7 rounded-xl py-2"
          >
            <Text>+1</Text>
          </Pressable>
        )}
        <Text>Current People Signed In: {countPeople}</Text>
      </View>
    </SafeAreaView>
  );
};

export default RollCall;
