import { AntDesign } from "@expo/vector-icons";
import { Controller, useFieldArray } from "react-hook-form";
import { TextInput, View, Text, Pressable } from "react-native";
import JobForm from "./JobForm";
import { useState } from "react";
import * as Crypto from "expo-crypto";

interface CarouselJobProps {
  control: any;
  errors: any;
}

const Carousel = ({ control, errors }: CarouselJobProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "crew",
    control,
  });
  const [crewIndex, setCrewIndex] = useState(-1);
  // console.log("crewIndex: ", crewIndex, "fields.length: ", fields.length);

  return (
    <>
      {fields.length > 0 && (
        <View className=" rounded-2xl bg-slate-200 w-full">
          <View className="flex flex-row items-center">
            <AntDesign
              name="caretleft"
              size={24}
              color="black"
              onPress={() => {
                setCrewIndex(() => {
                  return crewIndex === 0 ? crewIndex : crewIndex - 1;
                });
              }}
            />
            {fields.map((item, index) => (
              <View
                className={`flex-1 ${crewIndex === index ? "p-2 " : "hidden"}`}
                key={item.id}
              >
                <Controller
                  control={control}
                  name={`crew.${index}.crew_name`}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <View className="flex flex-row py-2">
                        <Text className="text-lg font-medium">Crew Name: </Text>
                        <TextInput
                          placeholder="Crew Name"
                          onBlur={onBlur}
                          value={value}
                          onChangeText={onChange}
                          className="border-2 border-black bg-white"
                        />
                      </View>
                    );
                  }}
                />
                {errors?.crew?.[index]?.crew_name?.message && (
                  <Text>{errors?.crew?.[index]?.crew_name?.message}</Text>
                )}
                <Text>id:{item.id}</Text>
                <JobForm
                  crewIndex={index}
                  role="crew"
                  control={control}
                  errors={errors}
                />
                <Pressable
                  onPress={() => {
                    const temp = index;

                    remove(index);
                    setCrewIndex(() =>
                      temp === fields.length - 1 ? temp - 1 : temp
                    );
                  }}
                  className="bg-red-300 p-3 rounded-full w-full"
                >
                  <Text className="text-center">Delete Crew</Text>
                </Pressable>
              </View>
            ))}
            <AntDesign
              name="caretright"
              size={24}
              color="black"
              onPress={() => {
                setCrewIndex(() => {
                  return crewIndex === fields.length - 1
                    ? crewIndex
                    : crewIndex + 1;
                });
              }}
            />
          </View>
          <View className="p-2 items-center flex-row justify-center gap-x-2">
            {fields.map((item, idx) => (
              <Pressable
                key={idx}
                className={`w-2 h-2 rounded-full
                ${crewIndex === idx ? "bg-black" : "bg-gray-400"}`}
                onPress={() => setCrewIndex(idx)}
              ></Pressable>
            ))}
          </View>
        </View>
      )}
      <View className="py-1">
        <Pressable
          onPress={() => {
            append({
              crew_name: "",
              crew_id: Crypto.randomUUID(),
              crew_job: [
                {
                  job_name: "",
                  description: "",
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ],
            });
            setCrewIndex(() => crewIndex + 1);
          }}
          className="bg-blue-400 p-3 rounded-full"
        >
          <Text className="text-center text-xl">Add Crew</Text>
        </Pressable>
      </View>
    </>
  );
};

export default Carousel;
