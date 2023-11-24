import { View, SafeAreaView, Text, Pressable, Modal } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils,
} from "react-native-calendars";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface TripProps {
  id: string;
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

const Info = ({ id, show, handleShow }: TripProps) => {
  return (
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View className={`p-5 rounded-2xl bg-gray-400 `}>
          <Text className="text-center font-bold text-2xl">{id} Info</Text>
          <Text className="font-medium text-lg">Captain: 王大明</Text>
          <Text>Calendar: </Text>
          <Pressable
            onPress={() => handleShow(false)}
            className="absolute top-2 right-2"
          >
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
          <Pressable
            // onPress={() => handleShow(false)}
            className="items-end bg-blue-500 p-2 rounded-2xl"
          >
            <Text>Edit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Info;
