import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import { Controller, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import PickDate from "./PickDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface JobFormProps {
  crewId: string;
  control: any;
  errors: any;
  crewIndex: number;
}

const JobForm = ({ crewId, control, errors, crewIndex }: JobFormProps) => {
  // const [toggle, setToggle] = useState(false);
  const captainId = getAuth().currentUser?.uid;

  const jobRole: "captain_job" | `crew.${number}.crew_job` =
    crewId !== captainId ? `crew.${crewIndex}.crew_job` : "captain_job";

  const { fields, prepend, remove } = useFieldArray({
    name: jobRole,
    control,
  });

  return (
    <View>
      <ScrollView className="h-fit">
        {fields.map((item, index) => (
          <View className="p-3 border-b-2 " key={item.id}>
            <Controller
              control={control}
              name={`${jobRole}.${index}.jobName`}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <View className="flex flex-row py-2 rounded-2xl">
                    <TextInput
                      label="Job Name"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      className=" bg-white flex-1"
                    />
                  </View>
                );
              }}
            />
            {crewId !== captainId
              ? errors?.crew?.[crewIndex!]?.crew_job?.[index]?.jobName
                  ?.message && (
                  <Text>
                    {
                      errors?.crew?.[crewIndex!]?.crew_job?.[index]?.jobName
                        ?.message
                    }
                  </Text>
                )
              : errors?.captain_job?.[index]?.jobName?.message && (
                  <Text>{errors?.captain_job?.[index]?.jobName?.message}</Text>
                )}

            <View className="flex p-3 gap-y-2">
              <View className="flex flex-row">
                <Controller
                  control={control}
                  name={`${jobRole}.${index}.startDate`}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <PickDate
                      onChange={onChange}
                      value={value ?? new Date()}
                      label="Start Date"
                    />
                  )}
                />
              </View>
              <View className="flex flex-row ">
                <Controller
                  control={control}
                  name={`${jobRole}.${index}.endDate`}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <PickDate
                      onChange={onChange}
                      value={value ?? new Date()}
                      label="End Date"
                    />
                  )}
                />
              </View>
            </View>

            <Pressable
              onPress={() => remove(index)}
              className="py-1 p-3 bg-red-400 rounded-full"
            >
              <Text className="text-center">Delete Job</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <View className="py-1">
        {/* <View className="p-2 border-b my-4"></View> */}
        <Pressable
          onPress={() =>
            prepend({
              job_name: "",
              description: "",
              startDate: new Date(),
              endDate: new Date(),
            })
          }
          className="mt-2 py-1 p-3 bg-blue-300 rounded-full"
        >
          <Text className="text-center">Add Job</Text>
        </Pressable>
      </View>
      {/* <Pressable
          onPress={() => setToggle(false)}
          className="absolute top-2 right-2"
        >
          <MaterialIcons name="close" color="black" size={22} />
        </Pressable> */}
    </View>
  );
};

export default JobForm;
