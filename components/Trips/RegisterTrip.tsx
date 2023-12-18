import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  useColorScheme,
  KeyboardAvoidingView,
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
import { useEffect, useState } from "react";

import {
  type RegisterFormSchema,
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
import RegisterTripInfo from "./RegisterTripInfo";
import useFetch from "@/hooks/useFetch";

interface RegisterTripProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

const RegisterTrip = ({ show, handleShow }: RegisterTripProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const captainId = getAuth().currentUser?.uid;
  const colorScheme = useColorScheme();

  const { loading: loadUsers, data: allUsers } = useFetch(
    collection(db, "users"),
    false
  );

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const userList: User[] = [];
    allUsers?.forEach((user: any) => {
      userList.push({ id: user.id, name: user.data().name });
    });
    setUsers(userList);
  }, [allUsers]);

  const registerTrip = async (data: RegisterFormSchema) => {
    const trip = {
      trip_name: data.trip_name,
      captain_id: captainId,
      captain_name:
        users[users.findIndex((user) => user.id === captainId!)].name,
      captain_job: data.captain_job,
      location: data.location,
      start_date: data.startDate,
      end_date: data.endDate,
      crew: data.crew.map((crew: any) => {
        return {
          crew_name:
            users[users.findIndex((user) => user.id === crew.crew_id)].name,
          ...crew,
        };
      }),
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
          start_date: data.startDate,
          end_date: data.endDate,
        }),
      });
      data.crew.map(async (crew: any) => {
        const userRef = doc(db, "users", crew.crew_id!);
        await updateDoc(userRef, {
          trips: arrayUnion({
            id: addedTrip.id,
            password: Math.random().toString(36).slice(-8),
            start_date: data.startDate,
            end_date: data.endDate,
          }),
        });
      });
      reset({ ...data });
      console.log("success", trip);
      handleShow(false);
    } catch (err) {
      console.log("err: ", err);
    }
    setPageIndex(0);
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

  const { fields, prepend, remove } = useFieldArray({
    name: "crew",
    control,
  });

  return (
    <Modal animationType="slide" visible={show} presentationStyle="pageSheet">
      <KeyboardAvoidingView behavior={"padding"} className="flex-1">
        <View
          className={`p-16 flex flex-1 items-center justify-between bg-white dark:bg-slate-800`}
        >
          <Text className="text-center font-bold text-3xl py-5 dark:text-white">
            Register Form
          </Text>
          <View className="w-full flex flex-row items-center justify-center">
            <AntDesign
              name="caretleft"
              size={24}
              color={`${colorScheme === "dark" ? "white" : "black"}`}
              onPress={() => {
                setPageIndex(() => {
                  return pageIndex === 0 ? pageIndex : pageIndex - 1;
                });
              }}
            />
            <View className={`flex-1 ${pageIndex === 0 ? "p-2 " : "hidden"}`}>
              <RegisterTripInfo control={control} errors={errors} />
            </View>
            {/* ADD CREW FORM PAGE 2 */}
            <View className={`flex-1 ${pageIndex === 1 ? "p-2 " : "hidden"}`}>
              <AddCrewPage
                fields={fields}
                prepend={prepend}
                remove={remove}
                users={users}
              />
            </View>
            {/* ADD JOB FORM PAGE 3 */}
            <View className={`flex-1 ${pageIndex === 2 ? "p-2 " : "hidden"}`}>
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
              color={`${colorScheme === "dark" ? "white" : "black"}`}
              onPress={() => {
                setPageIndex(() => {
                  return pageIndex === 2 ? pageIndex : pageIndex + 1;
                });
              }}
            />
          </View>
          <View>
            <Pressable
              className="bg-blue-300 rounded-full p-3"
              onPress={handleSubmit(registerTrip, (data) =>
                console.log("error:", data)
              )}
            >
              {isSubmitting ? (
                <ActivityIndicator size="large" className="text-gray-400" />
              ) : (
                <Text className="text-center text-xl px-2">Register</Text>
              )}
            </Pressable>
            <View className="p-4 items-center flex-row justify-center gap-x-4 dark:bg-slate-800">
              {[0, 1, 2].map((item, idx) => (
                <Pressable
                  key={idx}
                  className={`w-2 h-2 rounded-full
                ${
                  pageIndex === idx ? "bg-black dark:bg-white" : "bg-gray-400"
                }`}
                  onPress={() => setPageIndex(idx)}
                ></Pressable>
              ))}
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => handleShow(false)}
          className="absolute top-7 right-7"
        >
          <MaterialIcons
            name="close"
            color={`${colorScheme === "dark" ? "white" : "black"}`}
            size={22}
          />
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RegisterTrip;
