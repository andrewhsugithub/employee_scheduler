import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { Controller, useFieldArray, useForm } from "react-hook-form";

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
        <TextInput
          placeholder="Captain Name"
          defaultValue={`Captain: ${auth.currentUser?.displayName!}`}
          editable={false}
          className="border border-black bg-gray-200 flex-1 text-center rounded-full py-2"
        />
        <ScrollView className="h-32">
          {fields.map((item, index) => (
            <View className={`"p-2 "`} key={Crypto.randomUUID()}>
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
