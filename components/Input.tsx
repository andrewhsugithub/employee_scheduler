//! TEXT INPUT

import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: string;
  label: string;
  classname?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  isPassword?: boolean;
}

const Input = <T extends FieldValues>({
  control,
  errors,
  name,
  label,
  classname,
  left,
  isPassword,
  right,
}: InputProps<T>) => {
  const errorMessage = errors?.[name]?.message;

  return (
    <View className={`h-14 ${classname}`}>
      <Controller
        control={control}
        name={name as any}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View className="flex flex-row">
              <TextInput
                label={label}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                mode="flat"
                className="flex-1 rounded-md"
                underlineStyle={{
                  // borderRadius: 9999,
                  // width: "90%",
                  // justifyContent: "center",
                  // alignSelf: "center",
                  // alignContent: "center",
                  // start: "5%",
                  display: "none",
                }}
                left={left}
                right={right}
                secureTextEntry={isPassword}
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

export default Input;
