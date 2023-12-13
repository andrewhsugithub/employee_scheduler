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
  CollectionReference,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

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
import JobForm from "../JobForm";
import {} from "firebase/firestore";

interface RegisterTripProps {
  show: boolean;
  captainName: string;
  handleShow: (showModal: boolean) => void;
}

interface User {
  name: string;
  id: string;
}

// TODO turn into realtime database and make sure referential integrity
const RegisterTrip = ({ show, captainName, handleShow }: RegisterTripProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const captainId = getAuth().currentUser?.uid;
  const [users, setUsers] = useState<User[]>([]);

  const getInitData = async (ref: CollectionReference) => {
    const usersSnapshot = await getDocs(ref);
    const userList: User[] = [];
    usersSnapshot.forEach((user) => {
      userList.push({ id: user.id, name: user.data().name });
    });
    setUsers(userList);
  };

  useEffect(() => {
    const usersRef = collection(db, "users");
    getInitData(usersRef);

    const unsubscribe = onSnapshot(
      usersRef,
      { includeMetadataChanges: true },
      (usersSnapshot) => {
        const userList: User[] = [];
        usersSnapshot.forEach((user) => {
          userList.push({ id: user.id, name: user.data().name });
        });
        setUsers(userList);
      }
    );

    return unsubscribe();
  }, []);

  const registerTrip = async (data: RegisterFormSchema) => {
    // console.log("data: ", data);

    const trip = {
      trip_name: data.trip_name,
      captain_id: data.captain_id,
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
        trips: arrayUnion({
          id: addedTrip.id,
          password: Math.random().toString(36).slice(-8),
        }),
      });
      data.crew.map(async (crew: any) => {
        const userRef = doc(db, "users", crew.crew_id!);
        await updateDoc(userRef, {
          trips: arrayUnion({
            id: addedTrip.id,
            password: Math.random().toString(36).slice(-8),
          }),
        });
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
      captain_id: captainName,
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
      <View className={`p-16 items-center justify-center flex-1 bg-white`}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              name="captain_id"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <View className="flex flex-row py-2">
                    <TextInput
                      label="Captain Name"
                      onBlur={onBlur}
                      value={value}
                      editable={false}
                      mode="outlined"
                      className="flex-1"
                    />
                  </View>
                );
              }}
            />
            {errors?.captain_id?.message && (
              <Text>{errors?.captain_id?.message}</Text>
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
          {errors?.location?.message && (
            <Text>{errors?.location?.message}</Text>
          )}

          <View className="flex flex-row mx-4 my-8">
            <Controller
              control={control}
              name="startDate"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <View className="flex flex-row p-2 justify-left flex-1 rounded-full">
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
                  <View className="flex flex-row p-2 justify-center">
                    <PickDate
                      onChange={onChange}
                      value={value ?? new Date()}
                      label="End Date"
                    />
                  </View>
                );
              }}
            />
          </View>
          {errors?.endDate?.message && <Text>{errors?.endDate?.message}</Text>}
          <View className="h-4"></View>
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
                users={users}
              />
            </View>
            {/* ADD JOB FORM PAGE 2 */}
            <View className={`flex-1 ${pageIndex === 1 ? "p-2 " : "hidden"}`}>
              <AddJobPage
                control={control}
                errors={errors}
                crewArray={fields}
                users={users}
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
