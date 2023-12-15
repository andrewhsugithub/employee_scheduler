import { FlatList, Text, View, Modal, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect } from "react";

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

const Table = ({ show, handleShow }: TableProps) => {
  const data: TableItem[] = [
    { name: "Name", job: "Job", time: "Time" },
    { name: "John", job: "sleep", time: "0000-1200" },
    { name: "Bob", job: "eat", time: "0400-1200" },
    { name: "Mei", job: "dance", time: "0600-1000" },
    { name: "Steve", job: "cook", time: "0000-1800" },
  ];

  const renderItem = ({ item }: { item: TableItem }) => (
    <View style={{ flexDirection: "row" }}>
      <View className={"w-1/5 bg-white border-black border-solid border"}>
        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
          {item.name}
        </Text>
      </View>
      <View className={"w-1/5 bg-white border-black border-solid border"}>
        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
          {item.job}
        </Text>
      </View>
      <View className={"w-3/5 bg-white border-black border-solid border"}>
        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
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
            <Text>Job Scheduler</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10%",
            }}
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
