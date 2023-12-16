import { Control, FieldErrors } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { getAuth } from "firebase/auth";
import Input from "../Input";
import {
  type RegisterFormSchema,
  RegisterSchema,
} from "@/lib/validations/registerSchema";
import DateInput from "../DateInput";

interface TripInfoProps {
  control: Control<RegisterFormSchema>;
  errors: FieldErrors<RegisterFormSchema>;
}

const RegisterTripInfo = ({ control, errors }: TripInfoProps) => {
  const auth = getAuth().currentUser;

  return (
    <View className="flex flex-col p-3">
      <Input
        control={control}
        errors={errors}
        name={"trip_name"}
        label={"Trip Name"}
      />
      <View className="flex flex-row items-center py-4">
        <View className="flex flex-row py-2">
          <TextInput
            label="Captain Name"
            value={auth?.displayName!}
            editable={false}
            mode="flat"
            className="flex-1 rounded-full"
            underlineStyle={{
              display: "none",
            }}
          />
        </View>
      </View>
      <Input
        control={control}
        errors={errors}
        name={"location"}
        label={"Location"}
      />
      <View className="flex flex-row justify-between py-6">
        <DateInput
          control={control}
          errors={errors}
          name="startDate"
          label="Start Date"
        />
        <DateInput
          control={control}
          errors={errors}
          name="endDate"
          label="End Date"
        />
      </View>
    </View>
  );
};

export default RegisterTripInfo;
