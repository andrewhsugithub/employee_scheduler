﻿import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import {
  Control,
  Controller,
  type FieldValues,
  type UseFieldArrayPrepend,
  type UseFieldArrayRemove,
  useFieldArray,
  useForm,
  type FieldArrayWithId,
} from "react-hook-form";
import { TextInput } from "react-native-paper";
import { Searchbar, IconButton } from "react-native-paper";
import * as React from "react";
import { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import CrewChip from "../CrewChip";
import { useGetCollectionContext } from "@/context/getCollectionContext";

interface User {
  name: string;
  id: string;
}

interface AddCrewPageProps {
  prepend: any;
  fields: any;
  remove: UseFieldArrayRemove;
  users: User[];
}

const AddCrewPage = ({ fields, prepend, remove, users }: AddCrewPageProps) => {
  const { currentAuth: auth } = useGetCollectionContext();

  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const filteredCrewNames = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex flex-col itesm-center justify-between">
      <Text className="text-center font-bold text-xl dark:text-white p-3">
        Tap to add crew
      </Text>
      {/* TODO SEARCH BAR*/}
      <View className="p-5 rounded-3xl h-64">
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          className="bg-slate-200"
        />
        <ScrollView className="h-26">
          <View className="flex flex-row flex-wrap p-5">
            {filteredCrewNames.map((user: User) => (
              <CrewChip
                key={user.id}
                user={user}
                prepend={prepend}
                remove={remove}
                fields={fields}
                isCaptain={auth?.uid === user.id}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddCrewPage;
