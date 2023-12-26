import { useEffect, useState } from "react";
import { Card, Paragraph, ProgressBar } from "react-native-paper";
import { Pressable, View } from "react-native";
import InfoButton from "./InfoButton";
import {
  DocumentData,
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Info from "../Info";
import Table from "../TableComponents";
import RegisterTrip from "../RegisterTrip";
import useFetch from "@/hooks/useFetch";
import { useGetCollectionContext } from "@/context/getCollectionContext";
import Toast from "react-native-toast-message";
import PassForTrip from "../ongoing/PassForTrip";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

interface TripCardProps {
  tripId: string;
  isOngoing: boolean;
}

const TripCard = ({ tripId, isOngoing }: TripCardProps) => {
  const { currentAuth: auth } = useGetCollectionContext();
  const [crew, setCrew] = useState<User[]>([]);
  const [formattedStartingDate, setFormattedStartingDate] = useState<string>();
  const [formattedEndingDate, setFormattedEndingDate] = useState<string>();
  const [expanded, setExpanded] = useState(false);
  const [tripInterval, setTripInterval] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  const [showTripInfo, setShowTripInfo] = useState(false);
  const [showPassForTripPage, setShowPassForTripPage] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [crewPass, setCrewPass] = useState("");

  const { loading: loadTrip, data: tripData } = useFetch(
    doc(db, "trips", tripId!),
    true,
    "trips",
    tripId!
  );

  useEffect(() => {
    if (loadTrip || Object.keys(tripData!).length === 0) return;

    console.log("tripData:", tripData, tripId!);

    setCrew([
      {
        name: tripData?.captain_name,
        id: tripData?.captain_id,
      },
      ...tripData?.crew?.map((crewMember: any) => {
        return { name: crewMember.crew_name, id: crewMember.crew_id };
      }),
    ]);

    const startingDate = new Timestamp(
      tripData?.start_date.seconds,
      tripData?.start_date.nanoseconds
    ).toDate();
    const endingDate = new Timestamp(
      tripData?.end_date.seconds,
      tripData?.end_date.nanoseconds
    ).toDate();

    setFormattedStartingDate(formatDate(startingDate!.toISOString()));
    setFormattedEndingDate(formatDate(endingDate!.toISOString()));
    setTripInterval(subtractDates(endingDate!, startingDate!));
    setProgress(getProgress(startingDate!, endingDate!));

    setCrewPass(
      tripData?.captain_id !== auth?.uid
        ? tripData?.crew[
            tripData?.crew.findIndex((crew: any) => crew.crew_id === auth?.uid)
          ]?.crew_pass
        : tripData?.captain_pass
    );
  }, [tripData, loadTrip]);

  useEffect(() => {
    setExpanded(false);
  }, [showTripInfo, showPassForTripPage, showDetails, showEdit]);

  const showToast = (person: string) => {
    Toast.show({
      type: "error",
      text1: "⚠️Overtime",
      text2: person + " worked overtime ( >14hr )👋",
    });
    console.log("person: ", person, "show toast");
  };

  //! days
  useEffect(() => {
    if (loadTrip) return;
    console.log("isOngoing: ", isOngoing);
    // interval of 30 minutes
    const timeId = setInterval(async () => {
      if (!isOngoing) return;
      if (tripData?.crew) {
        Promise.all(
          tripData?.crew?.map(async (crew: any) => {
            const userRef = await AsyncStorage.getItem(
              "users_" + crew?.crew_id
            );
            const user = JSON.parse(userRef!);
            // Check if any day has more than 14 hours
            if (user?.days) {
              for (const hours of Object.values(user?.days)) {
                if ((hours as number) >= 14) {
                  showToast(user?.name);
                }
              }
            }
          })
        );
      }
      const captainRef = await AsyncStorage.getItem(
        "users_" + tripData?.captain_id
      );
      const captain = JSON.parse(captainRef!);
      // Check if any day has more than 14 hours
      if (captain?.days) {
        for (const hours of Object.values(captain?.days)) {
          if ((hours as number) >= 1) {
            showToast(captain?.name);
          }
        }
      }
    }, 1000 * 10); // millisecond
    return () => clearInterval(timeId);
  }, [isOngoing, tripData, loadTrip]);

  if (!loadTrip && Object.keys(tripData!).length === 0) return; //! here add a dialog say that need wifi connection

  return (
    <>
      <Pressable
        className="p-3 m-0"
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
            title={`Trip Name: ${tripData?.trip_name}`}
            subtitle={`Captain: ${tripData?.captain_name}`}
            className="z-50"
            right={() => (
              <InfoButton
                expanded={expanded}
                handleExpand={(expanded: boolean) => setExpanded(expanded)}
                handleShowTripInfo={(showModal: boolean) =>
                  setShowTripInfo(showModal)
                }
                handleShowRollCall={(showModal: boolean) =>
                  setShowPassForTripPage(showModal)
                }
                handleShowDetails={(showModal: boolean) =>
                  setShowDetails(showModal)
                }
                handleShowEdit={(showModal: boolean) => setShowEdit(showModal)}
                isOngoing={isOngoing}
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
              Location: {tripData?.location}
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
          name={tripData?.trip_name}
          show={showTripInfo}
          trips={tripData!}
          handleShow={(showModal: boolean) => setShowTripInfo(showModal)}
          crew={crew}
          tripId={tripId!}
        />
      )}
      {showPassForTripPage && (
        <PassForTrip
          show={showPassForTripPage}
          handleShow={(showModal: boolean) => setShowPassForTripPage(showModal)}
          password={crewPass}
        />
      )}
      {/* {isOngoing && (
        <>
          {showDetails && (
            <Table
              show={showDetails}
              handleShow={(showModal: boolean) => setShowDetails(showModal)}
              trips={tripData!}
            />
          )}
        </>
      )} */}
      {/* {showEdit && <RegisterTrip show={showEdit} handleShow={setShowEdit} />} */}
    </>
  );
};

export default TripCard;
