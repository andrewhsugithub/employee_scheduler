import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import AddCrewPage from "@/components/Trips/AddCrewPage";
import AddJobPage from "@/components/Trips/AddJobPage";
import {
  RegisterFormSchema,
  RegisterSchema,
} from "@/lib/validations/registerSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";

interface RegisterFormProps {
  show: boolean;
  captainName: string;
  handleShow: (showModal: boolean) => void;
}

// TODO turn into realtime database and make sure referential integrity
const Register = ({ show, captainName, handleShow }: RegisterFormProps) => {
  const [pageIndex, setPageIndex] = useState(0);

  const registerTrip = (data: RegisterFormSchema) => {
    console.log("data: ", data);

    const usersRef = collection(db, "trips");
    addDoc(usersRef, {})
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
    <Modal
      animationType="slide"
      visible={show}
      presentationStyle="pageSheet"
      // transparent={true}
    >
      {/* <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      > */}
      <View className={`p-5 bg-gray-400 items-center justify-center flex-1`}>
        <Text className=" text-center font-bold text-3xl py-5">
          Register Form
        </Text>
        <View className="flex flex-row items-center">
          <TextInput
            placeholder="Captain Name"
            defaultValue={`Captain: ${auth.currentUser?.displayName!}`}
            editable={false}
            className="border border-black bg-gray-200 flex-1 text-center rounded-full py-2"
          />
        </View>
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
            <AddCrewPage control={control} errors={errors} />
          </View>
          {/* ADD JOB FORM PAGE 2 */}
          <View className={`flex-1 ${pageIndex === 1 ? "p-2 " : "hidden"}`}>
            <AddJobPage />
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
        <Pressable
          className="bg-blue-400 rounded-full p-3"
          onPress={handleSubmit(registerTrip)}
        >
          {isSubmitting ? (
            <ActivityIndicator size="large" className="text-gray-400" />
          ) : (
            <Text className="text-center text-xl">Register</Text>
          )}
        </Pressable>
        <Text>
          See email for QR Code and verification code if register succeeds Note:
          you and your crew will also receive push notifications (see
          /employee_id/verify to verify) and email and sms? if register succeeds
        </Text>
        <Pressable
          onPress={() => {
            handleShow(false);
          }}
          className="absolute top-2 right-2"
        >
          <MaterialIcons name="close" color="#fff" size={22} />
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

export default Register;
