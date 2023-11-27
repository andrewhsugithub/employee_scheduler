﻿﻿import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import RegisterForm from "./RegisterForm";

interface AddTripButtonProps {
  captainName: string;
}

const AddTripButton = ({ captainName }: AddTripButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Pressable
        className="absolute bottom-4 right-4 rounded-2xl bg-blue-600 p-5"
        onPress={() => setShowModal(!showModal)}
      >
        <View className="flex-row justify-center items-center gap-x-3">
          <Ionicons name="add-circle-outline" size={36} color="white" />
          <Text className="font-bold text-white text-xl">Add New Trip</Text>
        </View>
      </Pressable>
      <RegisterForm
        show={showModal}
        captainName={captainName}
        handleShow={(showModal: boolean) => setShowModal(showModal)}
      />
    </>
  );
};

export default AddTripButton;