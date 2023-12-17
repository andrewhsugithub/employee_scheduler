import { FlatList, Text, View, Modal, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect } from "react";
//import Timeline from 'react-calendar-timeline'
import "react-calendar-timeline/lib/Timeline.css";

interface TableProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

interface TableItem {
  //id: number;
  name: string;
  job: string;
  time: string;
}

const groups = [
  { id: 1, title: "Employee 1" },
  { id: 2, title: "Employee 2" },
  // 員工們
];

const items = [
  {
    id: 1,
    group: 1,
    title: "Task A",
    start_time: new Date(2023, 1, 1, 9, 0),
    end_time: new Date(2023, 1, 1, 11, 0),
  },
  {
    id: 2,
    group: 1,
    title: "Task B",
    start_time: new Date(2023, 1, 1, 13, 0),
    end_time: new Date(2023, 1, 1, 15, 0),
  },
  {
    id: 3,
    group: 2,
    title: "Task C",
    start_time: new Date(2023, 1, 1, 10, 30),
    end_time: new Date(2023, 1, 1, 12, 30),
  },
  // 不同工作
];

const Table = ({ show, handleShow }: TableProps) => {
  const data: TableItem[] = [
    { name: "Name", job: "Job", time: "Time" },
    { name: "John", job: "sleep", time: "0000-1200" },
    { name: "Bob", job: "eat", time: "0400-1200" },
    { name: "Mei", job: "dance", time: "0600-1000" },
    { name: "Steve", job: "cook", time: "0000-1800" },
  ];

  const renderItem = ({ item }: { item: TableItem }) => (
    <View
      //style={{ flexDirection: "row" }}
      className="py-2 flex-row"
    >
      <View className={"w-1/5 bg-white border-black border-solid border"}>
        <Text
          //style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}
          className="text-sm font-bold text-center"
        >
          {item.name}
        </Text>
      </View>
      <View className={"w-1/5 bg-white border-black border-solid border"}>
        <Text
          //style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}
          className="text-sm font-bold text-center"
        >
          {item.job}
        </Text>
      </View>
      <View className={"w-3/5 bg-white border-black border-solid border"}>
        <Text
          //style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}
          className="text-sm font-bold text-center"
        >
          {item.time}
        </Text>
      </View>
    </View>
  );
  return (
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View
          className={`p-3 rounded-2xl bg-slate-200 w-4/5 h-4/5 justify-center`}
        >
          <View className="justify-center items-center">
            <Text className="text-xl">Job Scheduler</Text>
          </View>
          <View
            //style={{
            //  flex: 1,
            //  justifyContent: "center",
            //  alignItems: "center",
            //  marginTop: "10%",
            //}}
            className="flex-1 items-center justify-center"
          >
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.name.toString()}
            />
          </View>
          <Pressable
            onPress={() => handleShow(false)}
            className="absolute top-4 right-4"
          >
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
export default Table;
