import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, View, Pressable, TextInput } from "react-native";
import {
  DocumentReference,
  doc,
  getDoc,
  getDocFromCache,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useCheckConnectionContext } from "@/context/checkConnectionContext";
import { set } from "zod";

// TODO: make editable
const Profile = () => {
  const { isConnected } = useCheckConnectionContext();
  const user = getAuth().currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const getUserData = async () => {
    const userRef = doc(db, "users", user?.uid!);
    let userSnap;

    if (isConnected) userSnap = await getDoc(userRef);
    else userSnap = await getDocFromCache(userRef);

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
      <View className="flex-row ">
        <Text className="bg-pink-600 p-3 font-bold text-white">Hello!</Text>
        <TextInput
          value={name}
          placeholder="name"
          editable={isEditable}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View className="flex-row ">
        <Text className="bg-pink-600 p-3 font-bold text-white">Email:</Text>
        <TextInput
          value={email}
          placeholder="email"
          editable={isEditable}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View className="flex-row ">
        <Text className="bg-pink-600 p-3 font-bold text-white">
          Phone Number:
        </Text>
        <TextInput
          value={phoneNumber}
          placeholder="phone number"
          editable={isEditable}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      <Pressable className="rounded-2xl bg-blue-600 p-2" onPress={handleUpdate}>
        <View className="flex-row justify-center items-center">
          <Text className="font-bold text-white text-xl">Update</Text>
        </View>
      </Pressable>
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
