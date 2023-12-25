import { SafeAreaView, Text, View, Pressable, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import {
  DocumentReference,
  doc,
  getDoc,
  getDocFromCache,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useCheckConnectionContext } from "@/context/checkConnectionContext";
import { useGetCollectionContext } from "@/context/getCollectionContext";

// TODO: make editable
const Profile = () => {
  const { isConnected } = useCheckConnectionContext();
  const { currentAuth: user } = useGetCollectionContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const getUserData = async () => {
    const userRef = doc(db, "users", user?.uid!);
    let userSnap;

    if (isConnected) userSnap = await getDoc(userRef);
    else userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { email, name, phone_number } = userSnap.data();
      console.log("Document data:", userSnap.data());
      setName(name);
      setEmail(email);
      setPhoneNumber(phone_number);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleUpdate = async () => {};

  return (
    <SafeAreaView className="h-full gap-y-3">
      <ScrollView>
        <View className="py-8">
          <View className="flex-col space-x-2 px-20 py-4">
            <TextInput
              label="👤Name"
              value={name}
              editable={isEditable}
              mode="flat"
              className="flex-1 rounded-md"
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View className="flex-col space-x-2 px-20 py-4">
            <TextInput
              label="📧Email"
              value={email}
              editable={isEditable}
              mode="flat"
              className="flex-1 rounded-md"
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          {/* <View className="flex-col space-x-2 px-20 py-4">
            <TextInput
              label="📞Phone Number"
              value={phoneNumber}
              editable={isEditable}
              mode="flat"
              className="flex-1 rounded-md"
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View> */}
          <View className="py-12 px-20">
            <Pressable
              className="rounded-2xl bg-blue-600 p-2"
              onPress={handleUpdate}
            >
              <View className="flex-row justify-center items-center">
                <Text className="font-bold text-white text-xl">Update</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-4 right-4 rounded-2xl bg-blue-600 p-5"
        onPress={() => {
          setIsEditable(!isEditable);
        }}
      >
        <View className="flex-row justify-center items-center">
          <Text className="font-bold text-white text-xl">
            {isEditable ? "Done" : "Edit Profile"}
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Profile;
