import React from "react";
import uuid from "react-native-uuid";
import { View, Text, FlatList, Pressable, Modal } from "react-native";
import Interval from "@/components/Interval";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const timeIntervals = [1, 2, 3, 4, 5, 6, 7, 8];

function randomMinutes() {
  return Math.floor(Math.random() * 240);
}

const workers = [
  {
    name: "王大明",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "李小美",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "陳小華",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "林小玉",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "黃小花",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "張小明",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "林小明",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "陳小明",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "王小明",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "李小明",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
  {
    name: "黃小明",
    start: randomMinutes(),
    end: 240 + randomMinutes(),
    id: uuid.v4(),
  },
];

interface ScheduleProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

const Schedule = ({ show, handleShow }: ScheduleProps) => {
  return (
    <Modal animationType="slide" visible={show} presentationStyle="fullScreen">
      <View className="flex flex-row px-8 items-center">
        <Text className="text-center font-bold text-2xl w-1/5">Name</Text>
        <View className="flex flex-row justify-between items-center w-4/5">
          {timeIntervals.map((time) => (
            <Text key={time} className="text-center font-bold text-2xl">
              {time}:00
            </Text>
          ))}
        </View>
      </View>
      <FlatList
        data={workers}
        renderItem={({ item }) => (
          <Interval name={item.name} start={item.start} end={item.end} />
        )}
        keyExtractor={(item) => "" + item.id}
      />
      <Pressable
        onPress={() => handleShow(false)}
        className="absolute top-2 right-2"
      >
        <MaterialIcons name="close" color="#fff" size={22} />
      </Pressable>
    </Modal>
  );
};

export default Schedule;
