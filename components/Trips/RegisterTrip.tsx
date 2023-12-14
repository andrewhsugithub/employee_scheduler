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
import RegisterTripInfo from "./RegisterTripInfo";

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
    // getInitData(usersRef);

    const unsubscribe = onSnapshot(
      usersRef,
      { includeMetadataChanges: true },
      (usersSnapshot) => {
        console.log("change");
        const userList: User[] = [];
        usersSnapshot.forEach((user) => {
          userList.push({ id: user.id, name: user.data().name });
        });
        setUsers(userList);
      }
    );

    return () => unsubscribe();
  }, []);

  const registerTrip = async (data: RegisterFormSchema) => {
    // console.log("data: ", data);

    const trip = {
      trip_name: data.trip_name,
      captain_id: data.captain_id,
      captain_name:
        users[users.findIndex((user) => user.id === captainId!)].name,
      captain_job: data.captain_job,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
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
      <View
        className={`p-16 flex flex-1 items-center justify-between bg-white`}
      >
        <Text className="text-center font-bold text-3xl py-5">
          Register Form
        </Text>
        <View className="w-full flex flex-row items-center justify-center">
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
          <View className={`flex-1 ${pageIndex === 0 ? "p-2 " : "hidden"}`}>
            <RegisterTripInfo control={control} errors={errors} />
          </View>
          {/* ADD CREW FORM PAGE 2 */}
          <View className={`flex-1 ${pageIndex === 1 ? "p-2 " : "hidden"}`}>
            <AddCrewPage
              control={control}
              errors={errors}
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
            color="black"
            onPress={() => {
              setPageIndex(() => {
                return pageIndex === 2 ? pageIndex : pageIndex + 1;
              });
            }}
          />
        </View>
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
      </View>
      <Pressable
        onPress={() => {
          handleShow(false);
        }}
        className="absolute top-7 right-7"
      >
        <MaterialIcons name="close" color="black" size={22} />
      </Pressable>
    </Modal>
  );
};

export default RegisterTrip;
