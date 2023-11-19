import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, View, Pressable } from "react-native";

const CrewMember = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const startTrip = () => {
    router.push(`/${Math.random() * 1000}/rollcall`);
  };

  return (
    <SafeAreaView>
      <Text>Hello {params.employee_id}</Text>
      <Text>Your schedule in next trip: </Text>
      <Text className="text-red-600">
        If you are captain: Press Start Button this will be the qr code and
        verification code of the trip you receive in your email 1. make the ipad
        scan your qr code or type in the code first 2. when your crew arrives at
        the scene they can scan or enter the code on the ipad so that it means
        that they are here
      </Text>
      <Pressable className="bg-red-600 p-3" onPress={startTrip}>
        <Text className="font-bold text-white">Start Trip</Text>
      </Pressable>
      <Text className="text-red-600">
        No matter if you are crew or captain you all need to scan or type the
        code on the ipad
      </Text>
      <Pressable className="bg-green-600 p-3">
        <Text className="font-bold text-white">Scan QR Code</Text>
      </Pressable>
      <Text>Type Verification Code</Text>
      <Pressable className="bg-green-600 p-3">
        <Text className="font-bold text-white">Verify</Text>
      </Pressable>
      <Text>Your schedule in next trip: </Text>
      <Text>Your schedule in next trip: </Text>
    </SafeAreaView>
  );
};

export default CrewMember;
