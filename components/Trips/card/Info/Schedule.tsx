import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, View, Text, Modal } from "react-native";
import { AgendaList, CalendarProvider, Calendar } from "react-native-calendars";
import { DocumentData, Timestamp, doc, updateDoc } from "firebase/firestore";
import Item from "./calendar/Item";
import { getTheme } from "./calendar/theme";
import { TextInput } from "react-native-paper";
import { useGetCollectionContext } from "@/context/getCollectionContext";
import { useCheckConnectionContext } from "@/context/checkConnectionContext";
import InputPasswordPaper from "./Dialog";
import { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";

interface JobId {
  id: string;
  password: string;
  tripId: string;
  days: any;
}

interface JobTimeInfo {
  title: string;
  data: JobId[] | [{}];
}

interface MarkedDates {
  startingDay?: boolean;
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  color?: string;
  disabled?: boolean;
  endingDay?: boolean;
  dots?: any[];
  dotColor?: string;
}

//! TODO: calculate all crew hours after offboard

// type Modify<T, R> = Omit<T, keyof R> & R;

// interface JobEvent
//   extends Modify<
//     JobFormSchema,
//     {
//       startDate: Timestamp;
//       endDate: Timestamp;
//     }
//   > {}

interface ScheduleProps {
  trip: DocumentData;
  crewId: string;
  tripId: string;
}

const Schedule = ({ trip, crewId, tripId }: ScheduleProps) => {
  const [correctPassword, setCorrectPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const { currentAuth: auth } = useGetCollectionContext();
  const [jobEvent, setJobEvent] = useState<JobTimeInfo[]>([]);
  const [tripDates, setTripDates] = useState<Record<string, MarkedDates>>({});
  //const [aboard, setAboard] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const currentDate: Date = new Date();
  const endDate: Date = new Date(
    new Timestamp(trip?.end_date.seconds, trip?.end_date.nanoseconds).toDate()
  );
  const isDateExpired: boolean = currentDate > endDate;
  const { isConnected } = useCheckConnectionContext();
  const theme = useRef(getTheme());
  const password =
    auth?.uid === trip?.captain_id
      ? trip?.captain_pass
      : trip?.crew[trip?.crew.findIndex((crew: any) => crew.crew_id === crewId)]
          ?.crew_pass;

  const [isCaptain, setIsCaptain] = useState(true);
  const [isAboard, setIsAboard] = useState(false);
  const [isOffboard, setIsOffboard] = useState(false);

  const renderItem = useCallback(({ item }: any) => {
    return <Item item={item} />;
  }, []);

  const formattedDate = (date: Date) => {
    return date
      .toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replaceAll("/", "-");
  };

  // get trip dates
  useEffect(() => {
    const dates: Record<string, MarkedDates> = {};
    for (
      let date = new Date(
        new Timestamp(
          trip?.start_date.seconds,
          trip?.start_date.nanoseconds
        ).toDate()
      );
      ;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date
        .toLocaleString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replaceAll("/", "-");
      if (
        dateString >
        formattedDate(
          new Timestamp(
            trip?.end_date.seconds,
            trip?.end_date.nanoseconds
          ).toDate()
        )
      )
        break;

      dates[dateString] = {
        startingDay:
          formattedDate(date) ===
          formattedDate(
            new Timestamp(
              trip?.start_date.seconds,
              trip?.start_date.nanoseconds
            ).toDate()
          )
            ? true
            : false,
        color: "yellow",
        endingDay:
          formattedDate(date) ===
          formattedDate(
            new Timestamp(
              trip?.end_date.seconds,
              trip?.end_date.nanoseconds
            ).toDate()
          )
            ? true
            : false,
        dotColor: "#0099ff",
        marked: true,
      };
    }

    setTripDates(
      Object.keys(dates)
        .sort()
        .reduce((newDates: any, key: any) => {
          newDates[key] = dates[key];
          return newDates;
        }, {})
    );
  }, [trip]);

  // get job items
  useEffect(() => {
    const jobEvents: Record<string, JobId[]> = {};
    const jobs =
      crewId === trip?.captain_id
        ? trip?.captain_job
        : trip?.crew[
            trip?.crew.findIndex((crew: any) => crew.crew_id === crewId)
          ]?.crew_jobs;

    for (
      let date = new Date(
        new Timestamp(
          trip?.start_date.seconds,
          trip?.start_date.nanoseconds
        ).toDate()
      );
      date <=
      new Date(
        new Timestamp(
          trip?.end_date.seconds,
          trip?.end_date.nanoseconds
        ).toDate()
      );
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date
        .toLocaleString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replaceAll("/", "-");
      jobEvents[dateString] = [];
    }

    //TODO: ADD necessary item props
    jobs?.map((job: any) => {
      jobEvents[
        new Timestamp(job?.start_date.seconds, job?.start_date.nanoseconds)
          .toDate()
          .toLocaleString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replaceAll("/", "-")
      ].push({
        id: job?.id,
        password: password,
        tripId: tripId,
        days: job?.days,
      });
    });

    setJobEvent(
      Object.keys(jobEvents).map((dateString: string) => ({
        title: dateString,
        data:
          jobEvents[dateString].length > 0
            ? jobEvents[dateString]
            : [{ password: password, tripId: tripId }],
      }))
    );
  }, [trip]);

  // get aboard status
  useEffect(() => {
    const aboard =
      auth?.uid === trip?.captain_id
        ? trip?.captain_aboard_time
        : trip?.crew[
            trip?.crew.findIndex((crew: any) => crew.crew_id === crewId)
          ]?.crew_aboard_time;

    const offboard =
      auth?.uid === trip?.captain_id
        ? trip?.captain_offboard_time
        : trip?.crew[
            trip?.crew.findIndex((crew: any) => crew.crew_id === crewId)
          ]?.crew_offboard_time;
    setIsAboard(aboard === null ? false : true);
    setIsOffboard(offboard === null ? false : true);
  }, [trip]);

  const handleAboard = async () => {
    const docRef = doc(db, "trips", tripId);
    const aboardDate = new Date();
    const updatedFields =
      auth?.uid === trip?.captain_id
        ? { captain_aboard_time: aboardDate }
        : {
            crew: trip?.crew.map((crew: any) =>
              crew.crew_id === crewId
                ? { ...crew, crew_aboard_time: aboardDate }
                : crew
            ),
          };
    await updateDoc(docRef, updatedFields);

    // local update
    const tripDoc = await AsyncStorage.getItem("trips_" + tripId);
    const parsedTrip = JSON.parse(tripDoc!);
    const newTrip =
      auth?.uid === trip?.captain_id
        ? { ...parsedTrip, captain_aboard_time: aboardDate }
        : {
            ...parsedTrip,
            crew: parsedTrip?.crew.map((crew: any) =>
              crew.crew_id === crewId
                ? { ...crew, crew_aboard_time: aboardDate }
                : crew
            ),
          };
    await AsyncStorage.setItem("trips_" + tripId, JSON.stringify(newTrip));
  };

  const handleOffboard = async () => {
    const docRef = doc(db, "trips", tripId);
    const offboardDate = new Date();
    const updatedFields =
      auth?.uid === trip?.captain_id
        ? { captain_offboard_time: offboardDate }
        : {
            crew: trip?.crew.map((crew: any) =>
              crew.crew_id === crewId
                ? { ...crew, crew_offboard_time: offboardDate }
                : crew
            ),
          };
    await updateDoc(docRef, updatedFields);

    // local update
    const tripDoc = await AsyncStorage.getItem("trips_" + tripId);
    const parsedTrip = JSON.parse(tripDoc!);
    const newTrip =
      auth?.uid === trip?.captain_id
        ? { ...parsedTrip, captain_offboard_time: offboardDate }
        : {
            ...parsedTrip,
            crew: parsedTrip?.crew.map((crew: any) =>
              crew.crew_id === crewId
                ? { ...crew, crew_offboard_time: offboardDate }
                : crew
            ),
          };
    await AsyncStorage.setItem("trips_" + tripId, JSON.stringify(newTrip));
  };

  return (
    // <View className="">
    <>
      <CalendarProvider
        date={
          new Timestamp(
            trip?.start_date.seconds,
            trip?.start_date.nanoseconds
          ).toDate() > new Date()
            ? formattedDate(
                new Timestamp(
                  trip?.start_date.seconds,
                  trip?.start_date.nanoseconds
                ).toDate()
              )
            : new Timestamp(
                trip?.end_date.seconds,
                trip?.end_date.nanoseconds
              ).toDate() > new Date()
            ? formattedDate(
                new Timestamp(
                  trip?.start_date.seconds,
                  trip?.start_date.nanoseconds
                ).toDate()
              )
            : formattedDate(new Date())
        }
        // onDateChanged={onDateChanged}
        // onMonthChange={onMonthChange}
        showTodayButton={
          new Timestamp(
            trip?.start_date.seconds,
            trip?.start_date.nanoseconds
          ).toDate() > new Date()
            ? false
            : new Timestamp(
                trip?.end_date.seconds,
                trip?.end_date.nanoseconds
              ).toDate() > new Date()
            ? true
            : false
        }
        todayBottomMargin={100}
        // disabledOpacity={0.6}
        // theme={todayBtnTheme.current}
        className="flex flex-row gap-x-12"
      >
        <View className="flex flex-col gap-y-4">
          <Calendar
            markingType={"period"}
            className="p-6 rounded-2xl"
            theme={theme.current}
            markedDates={tripDates}
            enableSwipeMonths
            // onDayPress={onDayPress}
          />
          <View className="flex items-center justify-center">
            {isDateExpired ? ( //verify 顯示在history的tripinfo裡
              <Pressable
                className={`bg-teal-500 rounded-3xl p-3 ${
                  new Timestamp(
                    trip?.start_date.seconds,
                    trip?.start_date.nanoseconds
                  ).toDate() >= new Date() ||
                  new Timestamp(
                    trip?.end_date.seconds,
                    trip?.end_date.nanoseconds
                  ).toDate() <= new Date()
                    ? "opacity-60"
                    : ""
                }`}
                onPress={() => setVerified(!isVerified)} //功能還沒設計
              >
                <Text className="text-2xl font-bold text-center dark:text-white">
                  {isVerified ? "verified" : "verify"}
                </Text>
              </Pressable>
            ) : (
              //顯示在ongoing裡
              <>
                {!isAboard && !isOffboard && (
                  <Pressable
                    onPress={() => setShowDialog(true)}
                    className={`bg-teal-500 rounded-3xl p-3 ${
                      new Timestamp(
                        trip?.start_date.seconds,
                        trip?.start_date.nanoseconds
                      ).toDate() > new Date() && "opacity-60"
                    }`}
                  >
                    <Text className="text-2xl font-bold text-center dark:text-white">
                      Aboard
                    </Text>
                  </Pressable>
                )}
                {isAboard && !isOffboard && (
                  <Pressable
                    onPress={() => setShowDialog(true)}
                    className={`bg-teal-500 rounded-3xl p-3`}
                  >
                    <Text className="text-2xl font-bold text-center dark:text-white">
                      Offboard
                    </Text>
                  </Pressable>
                )}
                {isOffboard && (
                  <Pressable
                    className={`bg-teal-500 rounded-3xl p-3 ${
                      new Timestamp(
                        trip?.end_date.seconds,
                        trip?.end_date.nanoseconds
                      ).toDate() < new Date() && "opacity-60"
                    }`}
                  >
                    <Text className="text-2xl font-bold text-center dark:text-white">
                      Finished
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>
        <AgendaList
          sections={jobEvent as any}
          renderItem={renderItem}
          className="rounded-3xl bg-white mb-12"
          scrollToNextEvent
        />
      </CalendarProvider>
      <View>
        <InputPasswordPaper
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          correctPassword={password!}
          setPasswordValid={setPasswordValid}
          handleAfterConfirm={
            !isAboard
              ? async () => await handleAboard()
              : async () => await handleOffboard()
          }
        />
      </View>
    </>
  );
};

export default Schedule;
