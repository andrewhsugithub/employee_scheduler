import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import {
  type RegisterFormSchema,
  RegisterSchema,
} from "@/lib/validations/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import PickDate from "./PickDate";

interface JobFormProps {
  crewIndex?: number;
  role: string;
}

const JobForm = ({ crewIndex, role }: JobFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const jobRole: "captain_job" | `crew.${number}.crew_job` =
    role === "crew" ? `crew.${crewIndex!}.crew_job` : "captain_job";

  const { fields, append, remove } = useFieldArray({
    name: jobRole,
    control,
  });

  return (
    <View>
      <FlatList
        data={fields}
        renderItem={({ item, index }) => (
          <>
            <View className="bg-gray-300 rounded-2xl p-3">
              <Controller
                control={control}
                name={`${jobRole}.${index}.job_name`}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <View className="flex flex-row py-2 bg-gray-300 rounded-2xl">
                      <Text className="text-lg font-medium ">Job Name: </Text>
                      <TextInput
                        placeholder="Job Name"
                        onBlur={onBlur}
                        value={value}
                        onChangeText={onChange}
                        className="border-2 border-black bg-white w-[78.33vw]"
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
                        errors?.crew?.[crewIndex!]?.crew_job?.[index]?.job_name
                          ?.message
                      }
                    </Text>
                  )
                : errors?.captain_job?.[index]?.job_name?.message && (
                    <Text>
                      {errors?.captain_job?.[index]?.job_name?.message}
                    </Text>
                  )}

              <View className="flex flex-row">
                <Pressable className="bg-green-200 p-1 rounded-full">
                  <Text>Pick a Starting Date</Text>
                </Pressable>
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
                <Pressable className="bg-purple-200 p-1 rounded-full">
                  <Text>Pick a Ending Date</Text>
                </Pressable>
                <Controller
                  control={control}
                  name={`${jobRole}.${index}.endDate`}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => <PickDate onChange={onChange} value={value} />}
                />
              </View>

              <Pressable
                onPress={() => remove(index)}
                className="py-1 p-3 bg-red-200 rounded-full"
              >
                <Text className="text-center">Delete Job</Text>
              </Pressable>
            </View>
          </>
        )}
      />

      <Pressable
        onPress={() =>
          append({
            job_name: "",
            description: "",
            startDate: new Date(),
            endDate: new Date(),
          })
        }
        className="py-1 p-3 bg-yellow-200 rounded-full"
      >
        <Text className="text-center">Add Job</Text>
      </Pressable>
    </View>
  );
};

export default JobForm;
