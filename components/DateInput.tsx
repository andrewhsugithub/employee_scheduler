//! DATE INPUT

import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import PickDate from "./PickDate";

interface DateInputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: string;
  label: string;
}

const DateInput = <T extends FieldValues>({
  control,
  errors,
  name,
  label,
}: DateInputProps<T>) => {
  const errorMessage = errors?.[name]?.message;

  return (
    <View className="h-14">
      <Controller
        control={control}
        name={name as any}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View className="flex flex-row">
              <PickDate
                onChange={onChange}
                value={value ?? new Date()}
                label={label}
              />
            </View>
          );
        }}
      />
      {errorMessage && (
        <HelperText
          type="error"
          visible={true}
          padding="normal"
          className="my-0 py-0"
        >
          {errorMessage as string}
        </HelperText>
      )}
    </View>
  );
};

export default DateInput;
