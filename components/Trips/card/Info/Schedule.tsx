import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { AgendaList, CalendarProvider, Calendar } from "react-native-calendars";
import {
  JobSchema,
  type JobFormSchema,
} from "@/lib/validations/registerSchema";
import { DocumentData, Timestamp } from "firebase/firestore";
import Item from "./calendar/Item";
import { getTheme } from "./calendar/theme";
import { TextInput } from "react-native-paper";
import { useGetCollectionContext } from "@/context/getCollectionContext";

interface JobId {
  id: string;
  password: string;
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
}

const Schedule = ({ trip, crewId }: ScheduleProps) => {
  const { currentAuth: auth } = useGetCollectionContext();
  const [jobEvent, setJobEvent] = useState<JobTimeInfo[]>([]);
  const [tripDates, setTripDates] = useState<Record<string, MarkedDates>>({});
  const [aboard, setAboard] = useState(false);
  const theme = useRef(getTheme());
  const password =
    auth?.uid === trip?.captain_id
      ? trip?.captain_pass
      : trip?.crew[trip?.crew.findIndex((crew: any) => crew.crew_id === crewId)]
          ?.crew_pass;

  const renderItem = useCallback(({ item }: any) => {
    console.log("item: ", item);

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
  }, []);

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

    const getDiff = (startDate: Date, endDate: Date) => {
      const diffHour = endDate.getHours() - startDate.getHours() + "hr ";
      const diffMin =
        Math.abs(endDate.getMinutes() - startDate.getMinutes()) + "min";
      return diffHour + diffMin;
    };

    const getFormattedHour = (date: Date) => {
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return formattedHour + ":" + minutes + ampm;
    };

    //TODO: ADD necessary item props
    jobs?.map((job: { id: string; start_date: Timestamp }) => {
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
      });
    });

    setJobEvent(
      Object.keys(jobEvents).map((dateString: string) => ({
        title: dateString,
        data:
          jobEvents[dateString].length > 0
            ? jobEvents[dateString]
            : [{ password: password }],
      }))
    );
  }, []);

  return (
    // <View className="">
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
            onPress={() => setAboard(!aboard)}
          >
            <Text className="text-2xl font-bold text-center dark:text-white">
              {aboard ? "Offboard" : "Aboard"}
            </Text>
          </Pressable>
        </View>
      </View>
      <AgendaList
        sections={jobEvent as any}
        renderItem={renderItem}
        className="rounded-3xl bg-white mb-12"
        scrollToNextEvent
      />
    </CalendarProvider>
    // </View>
  );
};

export default Schedule;
