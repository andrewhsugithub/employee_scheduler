import { View, SafeAreaView, Text, Pressable, Modal } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Calendar from "./Calendar";

interface TripProps {
  name: string;
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

const Info = ({ name, show, handleShow }: TripProps) => {
  return (
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View className={`px-5 rounded-2xl bg-gray-400 w-4/5 h-3/5 `}>
          <Text className="text-center font-bold text-2xl">
            info of trip{name}
          </Text>
          <Pressable
            onPress={() => handleShow(false)}
            className="absolute top-2 right-2"
          >
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
          <Text className="font-medium text-lg">Captain: 王大明</Text>
          <Calendar />
        </View>
      </View>
    </Modal>
  );
};

export default Info;
