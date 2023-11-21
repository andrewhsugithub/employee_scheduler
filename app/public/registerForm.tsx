import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Stack } from "expo-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegisterFormSchema,
  RegisterSchema,
} from "@/lib/validations/registerSchema";
import JobForm from "@/components/JobForm";
import { AntDesign } from "@expo/vector-icons";
import { useRef } from "react";
import Carousel from "@/components/Carousel";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Register = () => {
  const registerTrip = () => {
    // TODO: make sure your boss verifies your trip, so send this form to your boss via email or ...
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  return (
    <SafeAreaView className="w-full">
      <Stack.Screen options={{ headerShown: false }} />
      <Text className="text-center font-bold uppercase text-3xl py-5">
        Register Form
      </Text>
      <View
        className="bg-gray-300 rounded-2xl p-3"
        style={{
          backgroundColor: "#3498db",
          borderRadius: 20,
          padding: 20,
          margin: 20,
        }}
      >
        <Controller
          control={control}
          name="boss"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="flex flex-row py-2">
                <Text className="text-lg font-medium text-white">
                  Boss Name:{" "}
                </Text>
                <TextInput
                  placeholder="Boss Name"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  className="border-2 border-black bg-white flex-1"
                />
              </View>
            );
          }}
        />
        {errors?.boss?.message && <Text>{errors?.boss?.message}</Text>}
        <Controller
          control={control}
          name="captain"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="flex flex-row py-2">
                <Text className="text-lg font-medium text-white">
                  Captain Name:{" "}
                </Text>
                <TextInput
                  placeholder="Captain Name"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  className="border-2 border-black bg-white flex-1"
                />
              </View>
            );
          }}
        />
        {errors?.captain?.message && <Text>{errors?.captain?.message}</Text>}
        <Text className="text-2xl text-white font-extrabold">
          Job Schedule for captain:{" "}
        </Text>
        <JobForm role="captain" />
        <Carousel control={control} errors={errors} />

        <Pressable
          className="bg-green-500 rounded-2xl p-5"
          onPress={registerTrip}
        >
          <Text>Register</Text>
        </Pressable>
        <Text>
          See email for QR Code and verification code if register succeeds Note:
          you and your crew will also receive push notifications (see
          /employee_id/verify to verify) and email and sms? if register succeeds
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Register;
