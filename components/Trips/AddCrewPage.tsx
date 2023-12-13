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

  useEffect(() => {
    if (
      fields.findIndex((item: any) => item.crew_id === auth.currentUser?.uid) <
      0
    )
      prepend({
        crew_id: auth.currentUser?.uid,
        crew_job: [],
      });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const filteredCrewNames = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="bg-slate-100 rounded-3xl p-3 m-8 ">
      <View className="flex py-2">
        {/* TODO SEARCH BAR*/}
        <View className="bg-white p-5 rounded-3xl">
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
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
        </View>
        {/* <ScrollView className="h-32">
          {fields.map((item: any, index: number) => (
            <View className={`p-2 border-b-2 `} key={item.id}>
              <Controller
                control={control}
                name={`crew.${index}.crew_name`}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <View className="flex flex-row items-center py-2 space-x-8">
                      <TextInput
                        label="Crew Name"
                        // placeholder="Type name ..."
                        onBlur={onBlur}
                        value={value}
                        onChangeText={onChange}
                        mode="outlined"
                        className="flex-1"
                      />
                      <Pressable
                        onPress={() => {
                          remove(index);
                        }}
                        className="bg-red-500 p-3 rounded-2xl py-2"
                      >
                        <Text className="text-center text-white text-xl">
                          Delete Crew
                        </Text>
                      </Pressable>
                    </View>
                  );
                }}
              />
              {errors?.crew?.[index]?.crew_name?.message && (
                <Text>{errors?.crew?.[index]?.crew_name?.message}</Text>
              )}
            </View>
          ))}
        </ScrollView>
        <View className="py-1">
          <View className="p-2 border-b my-4"></View>
          <Pressable
            onPress={() => {
              // prepend({
              //   crew_name: "",
              //   crew_job: [],
              // });
            }}
            className="bg-blue-400 p-3 rounded-full"
          >
            <Text className="text-center text-xl">Add Crew</Text>
          </Pressable>
        </View> */}
      </View>
    </View>
  );
};

export default AddCrewPage;
