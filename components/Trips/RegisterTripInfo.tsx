import { Controller } from "react-hook-form";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import PickDate from "../PickDate";
import { getAuth } from "firebase/auth";

interface TripInfoProps {
  control: any;
  errors: any;
}

const RegisterTripInfo = ({ control, errors }: TripInfoProps) => {
  const auth = getAuth().currentUser;

  return (
    <View className="flex p-3">
      <Controller
        control={control}
        name="trip_name"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View className="flex flex-row py-2">
              <TextInput
                label="Trip Name"
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
      {errors?.trip_name?.message && <Text>{errors?.trip_name?.message}</Text>}
      <View className="flex flex-row items-center py-4">
        <View className="flex flex-row py-2">
          <TextInput
            label="Captain Name"
            value={auth?.displayName!}
            editable={false}
            mode="outlined"
            className="flex-1"
          />
        </View>
      </View>
      <Controller
        control={control}
        name="location"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View className="flex flex-row">
              <TextInput
                label="Location"
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                mode="outlined"
                className=" flex-1 rounded-full"
              />
            </View>
          );
        }}
      />
      {errors?.location?.message && <Text>{errors?.location?.message}</Text>}
      <View className="flex flex-row justify-between py-6">
        <Controller
          control={control}
          name="startDate"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="">
                <PickDate
                  onChange={onChange}
                  value={value ?? new Date()}
                  label="Start Date"
                />
              </View>
            );
          }}
        />
        {errors?.startDate?.message && (
          <Text>{errors?.startDate?.message}</Text>
        )}
        <Controller
          control={control}
          name="endDate"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="">
                <PickDate
                  onChange={onChange}
                  value={value ?? new Date()}
                  label="End Date"
                />
              </View>
            );
          }}
        />
        {errors?.endDate?.message && <Text>{errors?.endDate?.message}</Text>}
      </View>
    </View>
  );
};

export default RegisterTripInfo;
