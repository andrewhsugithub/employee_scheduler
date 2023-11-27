﻿import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";

import { getAuth } from "firebase/auth";
import * as Crypto from "expo-crypto";

interface AddCrewPageProps {
  control: any;
  errors: any;
}

const AddCrewPage = ({ control, errors }: AddCrewPageProps) => {
  const auth = getAuth();
  const { fields, prepend, remove } = useFieldArray({
    name: "crew",
    control,
  });

  return (
    <View className="bg-slate-100 rounded-3xl p-3 m-8">
      <View className="flex py-2">
        <ScrollView className="h-32">
          {fields.map((item, index) => (
            <View className={`p-2 border-b-2 `} key={Crypto.randomUUID()}>
              <Controller
                control={control}
                name={`crew.${index}.crew_name`}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <View className="flex flex-row py-2">
                      <TextInput
                        label="Crew Name"
                        // placeholder="Type name ..."
                        onBlur={onBlur}
                        value={value}
                        onChangeText={onChange}
                        mode="outlined"
                        className="flex-1"
                      />
                    </View>
                  );
                }}
              />
              {errors?.crew?.[index]?.crew_name?.message && (
                <Text>{errors?.crew?.[index]?.crew_name?.message}</Text>
              )}
              <Pressable
                onPress={() => {
                  remove(index);
                }}
                className="bg-red-300 p-3 rounded-full w-full"
              >
                <Text className="text-center">Delete Crew</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View className="py-1">
          <View className="p-2 border-b-2 my-4"></View>
          <Pressable
            onPress={() => {
              prepend({
                crew_name: "",
                crew_job: [
                  {
                    startDate: new Date(),
                    endDate: new Date(),
                  },
                ],
              });
            }}
            className="bg-blue-400 p-3 rounded-full"
          >
            <Text className="text-center text-xl">Add Crew</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AddCrewPage;