import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { AgendaList, CalendarProvider, Calendar } from "react-native-calendars";
import {
  JobSchema,
  type JobFormSchema,
} from "@/lib/validations/registerSchema";
import { DocumentData, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Item from "./calendar/Item";
import { getTheme } from "./calendar/theme";

interface JobTime {
  hour?: string;
  duration?: string;
  title?: string;
}

interface JobTimeInfo {
  title: string;
  data: JobTime[];
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

type Modify<T, R> = Omit<T, keyof R> & R;

interface JobEvent
  extends Modify<
    JobFormSchema,
    {
      startDate: Timestamp;
      endDate: Timestamp;
    }
  > {}

interface ScheduleProps {
  trip: DocumentData;
}

const Schedule = ({ trip }: ScheduleProps) => {
  const auth = getAuth().currentUser;
  const [jobEvent, setJobEvent] = useState<JobTimeInfo[]>([]);
  const [tripDates, setTripDates] = useState<Record<string, MarkedDates>>({});
  const theme = useRef(getTheme());

  const renderItem = useCallback(({ item }: any) => {
    return <Item item={item} />;
  }, []);

  // get trip dates
  useEffect(() => {
    const dates: Record<string, MarkedDates> = {};
    for (
      let date = new Date(trip?.startDate.toDate());
      date <= new Date(trip?.endDate.toDate());
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
          date.toLocaleString() === trip?.startDate.toDate().toLocaleString()
            ? true
            : false,
        color: "red",
        endingDay:
          date.toLocaleString() === trip?.endDate.toDate().toLocaleString()
            ? true
            : false,
        dotColor: "#50cebb",
        marked: true,
      };
    }
    setTripDates(dates);
  }, []);

  // get job items
  useEffect(() => {
    const jobEvents: Record<string, JobTime[]> = {};
    const jobs =
      auth?.uid === trip?.captain_id
        ? trip?.captain_job
        : trip?.crew[trip?.crew.findIndex((crew: any) => crew.id === auth?.uid)]
            .jobName;

    for (
      let date = new Date(trip?.startDate.toDate());
      date <= new Date(trip?.endDate.toDate());
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
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return formattedHour + ampm;
    };

    jobs.map((job: JobEvent) => {
      jobEvents[
        job.startDate
          .toDate()
          .toLocaleString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replaceAll("/", "-")
      ].push({
        hour: getFormattedHour(job.startDate.toDate()),
        duration: getDiff(job.startDate.toDate(), job.endDate.toDate()),
        title: job.jobName!,
      });
    });

    setJobEvent(
      Object.keys(jobEvents).map((dateString: string) => ({
        title: dateString,
        data: jobEvents[dateString].length > 0 ? jobEvents[dateString] : [{}],
      }))
    );
  }, []);

  return (
    <View className=" h-full p-4">
      <CalendarProvider
        date={new Date()
          .toLocaleString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replaceAll("/", "-")}
        // onDateChanged={onDateChanged}
        // onMonthChange={onMonthChange}
        showTodayButton
        // disabledOpacity={0.6}
        // theme={todayBtnTheme.current}
        // todayBottomMargin={16}
        className="flex flex-row gap-x-12"
      >
        <Calendar
          markingType={"period"}
          className="p-6 rounded-2xl"
          // theme={theme.current}
          markedDates={tripDates}
          enableSwipeMonths
          // onDayPress={onDayPress}
        />
        <AgendaList
          sections={jobEvent as any}
          renderItem={renderItem}
          className="rounded-3xl bg-white mb-12"
          // scrollToNextEvent
          // sectionStyle={styles.section}
          // dayFormat={'yyyy-MM-d'}
        />
      </CalendarProvider>
    </View>
  );
};

export default Schedule;
