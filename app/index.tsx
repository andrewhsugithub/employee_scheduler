import Interval from "../components/Interval";
import React from "react";
import uuid from "react-native-uuid";
import { SafeAreaView, View, Text, ScrollView, FlatList } from "react-native";

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

const App = () => {
  return (
    <SafeAreaView className="h-screen">
      <Text className="text-center font-bold text-4xl py-10">Scheduler</Text>
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
    </SafeAreaView>
  );
};

export default App;
