import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Modal,
} from "react-native";
import {
  type Control,
  Controller,
  type FieldErrors,
  type FieldValues,
  useFieldArray,
  type ArrayPath,
  type FieldArray,
  Path,
} from "react-hook-form";
import { useState } from "react";
import { HelperText, TextInput } from "react-native-paper";
import PickDate from "./PickDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { collection, addDoc } from "firebase/firestore";
import Input from "./Input";
import DateInput from "./DateInput";
import { useGetCollectionContext } from "@/context/getCollectionContext";

interface JobFormProps<T extends FieldValues> {
  crewId: string;
  control: any;
  errors: any;
  crewIndex: number;
}

const JobForm = <T extends FieldValues>({
  crewId,
  control,
  errors,
  crewIndex,
}: JobFormProps<T>) => {
  // const [toggle, setToggle] = useState(false);
  const { currentAuth } = useGetCollectionContext();
  const captainId = currentAuth?.uid;

  const jobRole: "captain_job" | `crew.${number}.crew_job` =
    crewId !== captainId ? `crew.${crewIndex}.crew_job` : "captain_job";

  const { fields, prepend, remove } = useFieldArray({
    name: jobRole,
    control,
  });

  return (
    <View className="h-72">
      <ScrollView className="h-56">
        {fields.map((item, index) => (
          <View className="p-3 border-b-2 dark:border-white" key={item.id}>
            <Input
              control={control}
              errors={errors}
              name={`${jobRole}.${index}.jobName`}
              label={"Job Name"}
            />

            <View className="flex flex-row py-3 space-x-6 justify-center">
              <View className="w-52">
                <DateInput
                  control={control}
                  errors={errors}
                  name={`${jobRole}.${index}.startDate`}
                  label="Start Date"
                />
              </View>
              <View className="w-52">
                <DateInput
                  control={control}
                  errors={errors}
                  name={`${jobRole}.${index}.endDate`}
                  label="End Date"
                />
              </View>
            </View>

            <Pressable
              onPress={() => remove(index)}
              className="mt-3 py-1 p-3 bg-red-600 rounded-full"
            >
              <Text className="text-center text-white font-extrabold">
                Delete Job
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <View className="py-1">
        <Pressable
          onPress={() =>
            prepend({
              job_name: "",
              description: "",
              startDate: new Date(),
              endDate: new Date(),
            } as FieldArray<T, ArrayPath<T>> | FieldArray<T, ArrayPath<T>>[])
          }
          className="mt-2 py-1 p-3 bg-green-500 rounded-full"
        >
          <Text className="text-center text-white ">Add Job</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default JobForm;
