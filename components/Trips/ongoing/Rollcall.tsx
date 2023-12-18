import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Pressable, Modal } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RollCallProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
  tripId: string;
}

const RollCall = ({ show, handleShow, tripId }: RollCallProps) => {
  const router = useRouter();
  const [showSchedule, setShowSchedule] = useState(false); //! is this redundant? we can use const instead of state
  const [seePass, setSeePass] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function getPassword() {
      const password = await AsyncStorage.getItem(tripId);
      setPassword(password!);
    }
    getPassword();
  }, []);

  return (
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View className={`p-5 rounded-2xl bg-slate-200 w-2/5 h-1/5`}>
          {/* <Stack.Screen /> */}

          <Text>QR Code:</Text>

          {/* <View className="py-4 space-x-4 flex flex-row mr-2 h-26"> */}
          <TextInput
            label="Your Passcode for this trip"
            secureTextEntry={seePass ? false : true}
            value={password}
            editable={false}
            right={
              seePass ? (
                <TextInput.Icon
                  onPress={() => setSeePass(false)}
                  icon="eye-off"
                />
              ) : (
                <TextInput.Icon onPress={() => setSeePass(true)} icon="eye" />
              )
            }
          />
          {/* </View> */}

          {/* <View className="flex items-center justify-center">
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
          </View> */}
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
