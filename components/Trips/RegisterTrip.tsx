import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

import {
  RegisterFormSchema,
  RegisterSchema,
} from "@/lib/validations/registerSchema";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-paper";
import { getAuth } from "firebase/auth";
import PickDate from "../PickDate";
import AddCrewPage from "./AddCrewPage";
import AddJobPage from "./AddJobPage";

interface RegisterTripProps {
  show: boolean;
  captainName: string;
  handleShow: (showModal: boolean) => void;
}

// TODO turn into realtime database and make sure referential integrity
const RegisterTrip = ({ show, captainName, handleShow }: RegisterTripProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const captainId = getAuth().currentUser?.uid;

  const registerTrip = async (data: RegisterFormSchema) => {
    // console.log("data: ", data);

    const trip = {
      trip_name: data.trip_name,
      captain_name: data.captain_name,
      captain_job: data.captain_job,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      crew: data.crew,
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString(),
    };

    try {
      const tripsRef = collection(db, "trips");
      const addedTrip = await addDoc(tripsRef, trip);

      const userRef = doc(db, "users", captainId!);
      await updateDoc(userRef, {
        trips: arrayUnion(addedTrip.id),
      });
      console.log("success", trip);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      captain_name: captainName,
    },
  });

  const { fields, prepend, remove } = useFieldArray({
    name: "crew",
    control,
  });
  // console.log("fields: ", fields);

  return (
    <Modal animationType="slide" visible={show} presentationStyle="pageSheet">
      {/* <View 
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      > */}
      <View className={`p-16 items-center justify-center flex-1 bg-red-500`}>
        <ScrollView
          showsVerticalScrollIndicator={false} // 隱藏垂直滾動條
        >
          <Text className=" text-center font-bold text-3xl py-5">
            Register Form
          </Text>
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
          {errors?.trip_name?.message && (
            <Text>{errors?.trip_name?.message}</Text>
          )}
          <View className="flex flex-row items-center py-4">
            <Controller
              control={control}
              name="captain_name"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <View className="flex flex-row py-2">
                    <TextInput
                      label="Captain Name"
                      // onBlur={onBlur}
                      value={value}
                      editable={false}
                      mode="outlined"
                      className="flex-1"
                    />
                  </View>
                );
              }}
            />
            {errors?.captain_name?.message && (
              <Text>{errors?.captain_name?.message}</Text>
            )}
          </View>
          <Controller
            control={control}
            name="location"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => {
              return (
                <View className="flex flex-row ">
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
          {errors?.location?.message && (
            <Text>{errors?.location?.message}</Text>
          )}
          <Controller
            control={control}
            name="startDate"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => {
              return (
                <View className="flex flex-row p-2 justify-center">
                  <PickDate onChange={onChange} value={value ?? new Date()} />
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
                <View className="flex flex-row p-2 justify-center">
                  <PickDate onChange={onChange} value={value ?? new Date()} />
                </View>
              );
            }}
          />
          {errors?.endDate?.message && <Text>{errors?.endDate?.message}</Text>}

          <View className="flex flex-row items-center">
            <AntDesign
              name="caretleft"
              size={24}
              color="black"
              onPress={() => {
                setPageIndex(() => {
                  return pageIndex === 0 ? pageIndex : pageIndex - 1;
                });
              }}
            />

            {/* ADD CREW FORM PAGE 1 */}
            <View className={`flex-1 ${pageIndex === 0 ? "p-2 " : "hidden"}`}>
              <AddCrewPage
                control={control}
                errors={errors}
                fields={fields}
                prepend={prepend}
                remove={remove}
              />
            </View>
            {/* ADD JOB FORM PAGE 2 */}
            <View className={`flex-1 ${pageIndex === 1 ? "p-2 " : "hidden"}`}>
              <AddJobPage
                control={control}
                errors={errors}
                crewArray={fields}
              />
            </View>
            <AntDesign
              name="caretright"
              size={24}
              color="black"
              onPress={() => {
                setPageIndex(() => {
                  return pageIndex === 1 ? pageIndex : pageIndex + 1;
                });
                prepend({
                  crew_name: "",
                  crew_job: [
                    {
                      jobName: "",
                      startDate: new Date(),
                      endDate: new Date(),
                    },
                  ],
                });
                remove(0);
              }}
            />
          </View>

          {errors?.location?.message && (
            <Text>{errors?.location?.message}</Text>
          )}
          <Pressable
            className="bg-blue-400 rounded-full p-3"
            onPress={handleSubmit(registerTrip, (data) =>
              console.log("error:", data)
            )}
          >
            {isSubmitting ? (
              <ActivityIndicator size="large" className="text-gray-400" />
            ) : (
              <Text className="text-center text-xl">Register</Text>
            )}
          </Pressable>
          <Text>
            See email for QR Code and verification code if register succeeds
            Note: you and your crew will also receive push notifications (see
            /employee_id/verify to verify) and email and sms? if register
            succeeds
          </Text>
        </ScrollView>
        <Pressable
          onPress={() => {
            handleShow(false);
          }}
          className="absolute top-7 right-7"
        >
          <MaterialIcons name="close" color="black" size={22} />
        </Pressable>
        {/* <View className="p-2 items-center flex-row justify-center gap-x-2">
          {fields.map((item, idx) => (
            <Pressable
              key={idx}
              className={`w-2 h-2 rounded-full
                ${crewIndex === idx ? "bg-black" : "bg-gray-400"}`}
              onPress={() => setCrewIndex(idx)}
            ></Pressable>
          ))}
        </View> */}
      </View>
      {/* </View> */}
    </Modal>
  );
};

export default RegisterTrip;
