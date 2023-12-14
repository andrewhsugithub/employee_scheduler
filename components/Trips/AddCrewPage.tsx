import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { Searchbar, IconButton } from "react-native-paper";
import * as React from "react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import CrewChip from "../CrewChip";

interface User {
  name: string;
  id: string;
}

interface AddCrewPageProps {
  control: any;
  errors: any;
  fields: any;
  prepend: any;
  remove: any;
  users: User[];
}

const AddCrewPage = ({
  control,
  errors,
  fields,
  prepend,
  remove,
  users,
}: AddCrewPageProps) => {
  const auth = getAuth();

  // useEffect(() => {
  //   if (
  //     fields.findIndex((item: any) => item.crew_id === auth.currentUser?.uid) <
  //     0
  //   )
  //     prepend({
  //       crew_id: auth.currentUser?.uid,
  //       crew_job: [],
  //     });
  // }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const filteredCrewNames = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex p-3">
      <Text className="text-center font-bold text-xl">Tap to add crew</Text>
      {/* TODO SEARCH BAR*/}
      <View className="bg-white p-5 rounded-3xl">
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
                isCaptain={auth.currentUser?.uid === user.id}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddCrewPage;
