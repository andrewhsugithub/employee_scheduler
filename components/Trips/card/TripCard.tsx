import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  ProgressBar,
} from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";
import TripInfo from "@/components/TripInfo";
import InfoButton from "./InfoButton";
import { DocumentData, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Info from "../Info";
import Rollcall from "../ongoing/Rollcall";
import Table from "../TableComponents";
import RegisterTrip from "../RegisterTrip";

interface TripCardProps {
  tripId: string;
}

interface User {
  name: string;
  id: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-us", {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);

  return formattedDate;
};

function subtractDates(date1: Date, date2: Date) {
  const millisecondsDiff = date1.getTime() - date2.getTime();
  const hoursDiff = Math.floor(millisecondsDiff / (1000 * 60 * 60)); // Convert milliseconds to hours

  const weeks = Math.floor(hoursDiff / 168); // 1 week has 168 hours
  const days = Math.floor((hoursDiff % 168) / 24);
  const remainingHours = hoursDiff % 24;

  const formattedTime = `${weeks > 0 ? weeks + " weeks " : ""}${
    days > 0 ? days + " days " : ""
  }${remainingHours} hours`;
  return formattedTime.trim(); // Remove leading/trailing spaces
}

const getProgress = (startDate: Date, endDate: Date) => {
  // console.log("date:", startDate, endDate);
  const millisecondsDiff = new Date().getTime() - startDate.getTime();
  if (millisecondsDiff < 0) return 0; // Trip hasn't started yet
  const interval = endDate.getTime() - startDate.getTime();
  const progress = millisecondsDiff / interval;
  return progress;
};

const TripCard = ({ tripId }: TripCardProps) => {
  const [trip, setTrip] = useState<DocumentData>();
  const [captain, setCaptain] = useState<User>({} as User);
  const [crew, setCrew] = useState<User[]>([]);
  const [formattedStartingDate, setFormattedStartingDate] = useState<string>();
  const [formattedEndingDate, setFormattedEndingDate] = useState<string>();
  const [expanded, setExpanded] = useState(false);
  const [tripInterval, setTripInterval] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  const [showTripInfo, setShowTripInfo] = useState(false);
  const [showRollCall, setShowRollCall] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const tripRef = doc(db, "trips", tripId!);
    const unsubscribe = onSnapshot(
      tripRef,
      { includeMetadataChanges: true },
      (tripDoc) => {
        setTrip(tripDoc.data());
        setCaptain({
          name: tripDoc.data()?.captain_name,
          id: tripDoc.data()?.captain_id,
        });
        setCrew(
          tripDoc.data()?.crew?.map((crewMember: any) => {
            return { name: crewMember.crew_name, id: crewMember.id };
          })
        );

        const startingDate = tripDoc.data()?.startDate.toDate();
        const endingDate = tripDoc.data()?.endDate.toDate();
        setFormattedStartingDate(formatDate(startingDate!.toISOString()));
        setFormattedEndingDate(formatDate(endingDate!.toISOString()));
        setTripInterval(subtractDates(endingDate!, startingDate!));
        setProgress(getProgress(startingDate!, endingDate!));
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [showTripInfo, showRollCall, showDetails, showEdit]);

  return (
    <>
      <Pressable
        className="p-3 m-8"
        onLongPress={() => setExpanded(!expanded)}
        onPress={() => setExpanded(false)}
      >
        <Card className="bg-blue-200">
          <View className="">
            <Card.Cover
              className="object-fit"
              source={{ uri: "https://picsum.photos/700" }}
            />
          </View>
          <Card.Title
            title={`Trip Name: ${trip?.trip_name}`}
            subtitle={`Captain: ${captain?.name}`}
            className="z-50"
            right={() => (
              <InfoButton
                expanded={expanded}
                handleExpand={(expanded: boolean) => setExpanded(expanded)}
                handleShowTripInfo={(showModal: boolean) =>
                  setShowTripInfo(showModal)
                }
                handleShowRollCall={(showModal: boolean) =>
                  setShowRollCall(showModal)
                }
                handleShowDetails={(showModal: boolean) =>
                  setShowDetails(showModal)
                }
                handleShowEdit={(showModal: boolean) => setShowEdit(showModal)}
              />
            )}
          />
          <Card.Content>
            <Paragraph className="text-slate-500">
              Start: {formattedStartingDate}
            </Paragraph>
            <Paragraph className="text-slate-500">
              End: {formattedEndingDate}
            </Paragraph>
            <Paragraph className="text-slate-500">
              Interval: {tripInterval}
            </Paragraph>
            <Paragraph className="text-slate-500">
              Location: {trip?.location}
            </Paragraph>
            <View className="pt-1">
              <ProgressBar
                progress={progress}
                color={"blue"}
                className="rounded-full"
              />
            </View>
          </Card.Content>
        </Card>
      </Pressable>
      {showTripInfo && (
        <Info
          name={trip?.trip_name}
          show={showTripInfo}
          trips={trip!}
          handleShow={(showModal: boolean) => setShowTripInfo(showModal)}
        />
      )}
      {showRollCall && (
        <Rollcall
          show={showRollCall}
          handleShow={(showModal: boolean) => setShowRollCall(showModal)}
        />
      )}
      {showDetails && (
        <Table
          show={showDetails}
          handleShow={(showModal: boolean) => setShowDetails(showModal)}
        />
      )}
      {showEdit && (
        <RegisterTrip
          show={showEdit}
          handleShow={setShowEdit}
          captainName={trip?.captain_name}
        />
      )}
    </>
  );
};

export default TripCard;
