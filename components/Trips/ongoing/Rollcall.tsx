import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Text, Pressable, Modal } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface RollCallProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

const RollCall = ({ show, handleShow }: RollCallProps) => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [countPeople, setCountPeople] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false); //! is this redundant? we can use const instead of state

  return (
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View className={`p-5 rounded-2xl bg-gray-400`}>
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
                onPress={() => setShowSchedule(true)}
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
          <Pressable
            onPress={() => handleShow(false)}
            className="absolute top-2 right-2"
          >
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RollCall;
