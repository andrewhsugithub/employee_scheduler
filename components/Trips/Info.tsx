import { View, SafeAreaView, Text, Pressable, Modal } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Calendar from "./Calendar";
import { DocumentData } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  JobSchema,
  type JobFormSchema,
} from "@/lib/validations/registerSchema";

interface TripProps {
  name: string;
  show: boolean;
  handleShow: (showModal: boolean) => void;
  trips: DocumentData;
}

interface CrewInfo {
  name: string;
  id: string;
  jobs: JobFormSchema[];
}

const Info = ({ name, show, handleShow, trips }: TripProps) => {
  const auth = getAuth().currentUser;
  const [crewInfo, setCrewInfo] = useState<CrewInfo>();
  const [captainName, setCaptain] = useState("");

  const getCrewInfo = () => {
    if (trips.captain_id === auth?.uid) {
      setCrewInfo({
        name: trips.captain_name,
        id: trips.captain_id,
        jobs: trips.captain_job,
      });
      return;
    } else {
      trips.crew.findIndex((crewMember: any) => {
        if (crewMember.crew_id === auth?.uid) {
          setCrewInfo({
            name: trips.captain_name,
            id: trips.captain_id,
            jobs: trips.captain_job,
          });
          return;
        }
      });
    }
  };

  useEffect(() => {
    getCrewInfo();
    setCaptain(trips.captain_name);
  }, []);

  return (
    <Modal animationType="slide" visible={show} transparent={true}>
      <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      >
        <View className={`px-5 rounded-2xl bg-slate-100 w-4/5 h-3/5 p-3 `}>
          <View>
            <Text className="text-center font-bold text-2xl">
              info of trip{name}
            </Text>
          </View>
          <Pressable
            onPress={() => handleShow(false)}
            className="absolute top-2 right-2"
          >
            <MaterialIcons name="close" color="#000" size={22} />
          </Pressable>
          <View>
            <Text className="font-medium text-lg">Captain: {captainName}</Text>
          </View>
          <View className="flex flex-row justify-center items-center">
            <Calendar trip={trips!} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default Info;
