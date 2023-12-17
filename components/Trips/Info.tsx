import {
  View,
  SafeAreaView,
  Text,
  Pressable,
  Modal,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DocumentData } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  JobSchema,
  type JobFormSchema,
} from "@/lib/validations/registerSchema";
import Schedule from "./card/Info/Schedule";

interface TripProps {
  name: string;
  show: boolean;
  handleShow: (showModal: boolean) => void;
  trips: DocumentData;
  crew: User[];
}

const Info = ({ name, show, handleShow, trips, crew }: TripProps) => {
  const auth = getAuth().currentUser;
  const colorSheme = useColorScheme();
  const [selectedCrew, setSelectedCrew] = useState(auth?.uid);

  return (
    <Modal animationType="slide" visible={show} presentationStyle="pageSheet">
      {/* <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      > */}
      <View className={`p-10 bg-white dark:bg-slate-800 h-full`}>
        <Text className="text-center font-bold text-2xl dark:text-white">
          Schedule
        </Text>
        {auth?.uid === trips?.captain_id ? (
          <>
            {crew.map((user: User) => (
              <View
                key={user.id}
                className={`${
                  selectedCrew !== user.id ? "hidden" : ""
                }  h-full p-4`}
              >
                <Text className="font-medium text-lg dark:text-white text-center p-3">
                  Name: {user.name}
                </Text>
                <Schedule trip={trips!} crewId={user.id} />
              </View>
            ))}
          </>
        ) : (
          <View className=" h-full p-4">
            <Text className="font-medium text-lg dark:text-white text-center p-3">
              Name: {auth?.displayName}
            </Text>
            <Schedule trip={trips!} crewId={auth?.uid!} />
          </View>
        )}
        {/* <>
          <Text className="font-medium text-lg dark:text-white text-center p-3">
            Name: {auth?.displayName}
          </Text>
          <Schedule trip={trips!} crewId={auth?.uid!} />
        </> */}
      </View>
      <Pressable
        onPress={() => handleShow(false)}
        className="absolute top-2 right-2"
      >
        <MaterialIcons
          name="close"
          className="dark:text-white"
          size={22}
          color={`${colorSheme === "dark" ? "white" : "black"}`}
        />
      </Pressable>
      {/* </View> */}
    </Modal>
  );
};
export default Info;
