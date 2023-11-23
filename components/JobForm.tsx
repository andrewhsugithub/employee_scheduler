import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import { Controller, useFieldArray } from "react-hook-form";
import { useState } from "react";
import PickDate from "./PickDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface JobFormProps {
  crewIndex?: number;
  role: string;
  control: any;
  errors: any;
}

const JobForm = ({ crewIndex, role, control, errors }: JobFormProps) => {
  const [toggle, setToggle] = useState(false);

  const jobRole: "captain_job" | `crew.${number}.crew_job` =
    role === "crew" ? `crew.${crewIndex!}.crew_job` : "captain_job";

  const { fields, append, remove } = useFieldArray({
    name: jobRole,
    control,
  });

  return (
    <>
      <Modal animationType="slide" visible={toggle} transparent={true}>
        <View
          className={`absolute bg-transparent bottom-1/4 top-1/4 right-0 left-0 z-10 items-center justify-center`}
        >
          <View className={`p-5 rounded-2xl bg-gray-400 w-1/2`}>
            {fields.length > 0 && (
              <ScrollView className="h-full">
                {fields.map((item, index) => (
                  <View
                    className="bg-slate-500 rounded-2xl p-3 my-2"
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
                            <Text className="text-lg font-medium text-white">
                              Job Name:{" "}
                            </Text>
                            <TextInput
                              placeholder="Job Name"
                              onBlur={onBlur}
                              value={value}
                              onChangeText={onChange}
                              className="border-2 border-black bg-white flex-1"
                            />
                          </View>
                        );
                      }}
                    />
                    {role === "crew"
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
                        <Text className="text-white">
                          Pick a Starting Date:{"\t"}
                        </Text>
                        <Controller
                          control={control}
                          name={`${jobRole}.${index}.startDate`}
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error },
                          }) => <PickDate onChange={onChange} value={value} />}
                        />
                      </View>
                      <View className="flex flex-row ">
                        <Text className="text-white">
                          Pick a Ending Date:{"\t"}
                        </Text>
                        <Controller
                          control={control}
                          name={`${jobRole}.${index}.endDate`}
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error },
                          }) => <PickDate onChange={onChange} value={value} />}
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
                append({
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
              <MaterialIcons name="close" color="#fff" size={22} />
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
