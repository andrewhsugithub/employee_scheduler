﻿import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegisterFormSchema,
  RegisterSchema,
} from "@/lib/validations/registerSchema";
import JobForm from "@/components/JobForm";
import Carousel from "@/components/Carousel";
import * as Crypto from "expo-crypto";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

interface RegisterFormProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

const Register = ({ show, handleShow }: RegisterFormProps) => {
  const registerTrip = (data: RegisterFormSchema) => {
    // TODO: make sure your boss verifies your trip, so send this form to your boss via email or ...
    console.log("data: ", data);

    const usersRef = collection(db, "trips");
    addDoc(usersRef, { captain_name: data.captain })
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
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
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View className={`p-5 rounded-2xl bg-gray-400 `}>
          <Text className=" text-center font-bold uppercase text-3xl py-5">
            Register Form
          </Text>

          <View className="bg-slate-100 rounded-3xl p-3 m-8">
            <Controller
              control={control}
              name="captain"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <View className="flex flex-row py-2">
                    <TextInput
                      placeholder="Captain Name"
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                      className="border border-black bg-gray-200 flex-1 text-center rounded-full py-2"
                    />
                  </View>
                );
              }}
            />
            {errors?.captain?.message && (
              <Text>{errors?.captain?.message}</Text>
            )}

            <Text className="text-2xl text-black font-extrabold">
              Job Schedule for captain:{" "}
            </Text>

            <JobForm role="captain" control={control} errors={errors} />
            <Carousel control={control} errors={errors} />

            {isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Pressable
                className="bg-blue-400 rounded-full p-3"
                onPress={handleSubmit(registerTrip)}
              >
                <Text className="text-center text-xl">Register</Text>
              </Pressable>
            )}
            <Text>
              See email for QR Code and verification code if register succeeds
              Note: you and your crew will also receive push notifications (see
              /employee_id/verify to verify) and email and sms? if register
              succeeds
            </Text>
          </View>
          <Pressable
            onPress={() => handleShow(false)}
            className="absolute top-2 right-2"
          >
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default Register;
