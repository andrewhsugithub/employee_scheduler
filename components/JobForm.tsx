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
  const [toggle, setToggle] = useState(false);
  const captainId = getAuth().currentUser?.uid;

  const jobRole: "captain_job" | `crew.${number}.crew_job` =
    crewId !== captainId ? `crew.${crewIndex}.crew_job` : "captain_job";

  const { fields, prepend, remove } = useFieldArray({
    name: jobRole,
    control,
  });

  return (
    <>
      <Modal animationType="slide" visible={toggle} transparent={true}>
        <View
          className={`absolute bg-transparent bottom-1/4 top-1/4 right-0 left-0 z-10 items-center justify-center`}
        >
          <View className={`p-5 rounded-2xl bg-white border-4 w-1/2`}>
            {fields.length > 0 && (
              <ScrollView className="h-full">
                {fields.map((item, index) => (
                  <View
                    className="bg-white-900 rounded-2xl p-3 my-2"
                    key={item.id}
                  >
                    <Controller
                      control={control}
                      name={`${jobRole}.${index}.job_name`}
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
                    {crewIndex !== 0
                      ? errors?.crew?.[crewIndex!]?.crew_job?.[index]?.job_name
                          ?.message && (
                          <Text>
                            {
                              errors?.crew?.[crewIndex!]?.crew_job?.[index]
                                ?.job_name?.message
                            }
                          </Text>
                        )
                      : errors?.captain_job?.[index]?.job_name?.message && (
                          <Text>
                            {errors?.captain_job?.[index]?.job_name?.message}
                          </Text>
                        )}

                    <View className="flex p-3 gap-y-2">
                      <View className="flex flex-row">
                        <Text>Pick a Starting Date:{"\t"}</Text>
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
                            />
                          )}
                        />
                      </View>
                      <View className="flex flex-row ">
                        <Text>Pick a Ending Date:{"\t"}</Text>
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
            )}

            <Pressable
              onPress={() =>
                prepend({
                  job_name: "",
                  description: "",
                  startDate: new Date(),
                  endDate: new Date(),
                })
              }
              className="py-1 p-3 bg-blue-400 rounded-full"
            >
              <Text className="text-center">Add Job</Text>
            </Pressable>
            <Pressable
              onPress={() => setToggle(false)}
              className="absolute top-2 right-2"
            >
              <MaterialIcons name="close" color="black" size={22} />
            </Pressable>
          </View>
        </View>
      </Modal>
      <View className=" items-center justify-center flex">
        <Pressable
          onPress={() => setToggle(true)}
          className="bg-cyan-300 rounded-full w-fit p-2"
        >
          <Text>See Jobs</Text>
        </Pressable>
      </View>
    </>
  );
};

export default JobForm;
