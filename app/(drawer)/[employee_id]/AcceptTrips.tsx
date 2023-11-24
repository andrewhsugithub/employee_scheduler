import AddTripButton from "@/components/Trips/AddTripButton";
import Info from "@/components/Trips/Info";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";

const AcceptTrips = () => {
  const [toggleModal, setToggleModal] = useState(false);

  return (
    <SafeAreaView className="h-full">
      <Text>Your trips to verify:</Text>
      <View className="flex flex-row justify-center items-center">
        <Text>Trip #1</Text>
        <Pressable onPress={() => setToggleModal(true)} className="bg-blue-500">
          <Text>Info</Text>
        </Pressable>
        <Info
          id={Math.random() * 100000 + ""}
          show={toggleModal}
          handleShow={(showModal: boolean) => setToggleModal(showModal)}
        />
        <Pressable className="rounded-3xl bg-green-500 p-2">
          <Text>Go</Text>
        </Pressable>
        <Pressable className="rounded-3xl bg-red-500 p-2">
          <Text>Don't Go</Text>
        </Pressable>
      </View>
      <Text>Trip #1</Text>
      <Text>Trip #1</Text>
      <Text>Trip #1</Text>
      <AddTripButton />
    </SafeAreaView>
  );
};

export default AcceptTrips;
