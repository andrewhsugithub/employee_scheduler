import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import {
  JobSchema,
  type JobFormSchema,
} from "@/lib/validations/registerSchema";
import { DocumentData } from "firebase/firestore";

interface JobInfo {
  startDate: string;
  endDate: string;
  jobName: string;
  jobDescription: string | undefined;
}

interface MarkedDates {
  startingDates?: boolean;
  selected: boolean;
  marked: boolean;
  selectedColor: string;
  color: string;
  disabled?: boolean;
  endingDates?: boolean;
}

interface ExpandableCalendarProps {
  trip: DocumentData;
}

const ExpandableCalendar: React.FC<ExpandableCalendarProps> = ({
  trip,
}: ExpandableCalendarProps) => {
  const [jobInfo, setJobInfo] = useState<JobInfo>();
  // const [tripStartDate, setTripStartDate] = useState<Date>();
  // const [tripEndDate, setTripEndDate] = useState<Date>();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [showFlatList, setShowFlatList] = useState(false);
  const [tripDates, setTripDates] = useState<Record<string, MarkedDates>>({});

  useEffect(() => {
    getJobInfo();
    // setTripStartDate(
    //   trip.startDate.toDate().toLocaleString({ "zh-TW": "yyyy-MM-dd" })
    // );
    // setTripEndDate(
    //   trip.endDate.toDate().toLocaleString({ "zh-TW": "yyyy-MM-dd" })
    // );

    const dates: Record<string, MarkedDates> = {};
    for (
      let date = new Date(trip.startDate.toDate());
      date <= new Date(trip.endDate.toDate());
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
        startingDates: date === trip.startDate || true,
        selected: true,
        marked: true,
        selectedColor: "red",
        color: "red",
        endingDates: date === trip.endDate || true,
        disabled: date === trip.endDate || true,
      };
    }
    setTripDates(dates);
    console.log(dates);
  }, []);

  // const [markedDates, setMarkedDates] = useState(tripDates);

  // console.log(markedDates);
  // const [markedDates, setMarkedDates] = useState({
  //   "2023-12-02": {
  //     startingDates: true,
  //     selected: true,
  //     marked: true,
  //     selectedColor: "red",
  //     color: "red",
  //   },
  //   "2023-12-03": {
  //     selected: true,
  //     marked: true,
  //     selectedColor: "red",
  //     color: "red",
  //   },
  //   "2023-12-04": {
  //     disabled: true,
  //     marked: true,
  //     selected: true,
  //     selectedColor: "blue",
  //     color: "red",
  //     endingDates: true,
  //   },
  //   //這裡放此trip包含哪幾天
  // });

  const getJobInfo = () => {
    trip?.crew?.jobs?.map((crewJob: JobFormSchema) => {
      setJobInfo({
        startDate: crewJob.startDate.toLocaleString(),
        endDate: crewJob.endDate.toLocaleString(),
        jobName: crewJob.jobName!,
        jobDescription: crewJob.jobDescription,
      });
    });
  };

  const onDayPress = (day: { dateString: React.SetStateAction<string> }) => {
    // 切换 FlatList 是否隱藏
    setShowFlatList(true);
    // 更新點選的日期
    setSelectedDate(day.dateString);
  };

  LocaleConfig.locales["en"] = {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthNamesShort: [
      "Jan.",
      "Feb.",
      "Mar.",
      "Apr.",
      "May",
      "Jun.",
      "Jul.",
      "Aug.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dec.",
    ],
    dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };

  LocaleConfig.defaultLocale = "en";

  type EventsData = {
    [date: string]: Array<{ time: string; job: string }>;
  };

  const eventsData: EventsData = {
    "2023-12-02": [
      { time: "1:00 A.M. ~ 3:00 A.M.", job: "捕魚" },
      { time: "3:00 P.M. ~ 4:00 P.M.", job: "殺魚" },
    ],
    "2023-12-03": [
      { time: "4:00 P.M. ~ 5:00 P.M.", job: "殺魚" },
      { time: "5:00 P.M. ~ 6:00 P.M.", job: "殺魚" },
    ],
    "2023-12-04": [
      { time: "1:00 A.M. ~ 3:00 A.M.", job: "捕魚" },
      { time: "3:00 P.M. ~ 4:00 P.M.", job: "殺魚" },
    ],
    //這裡放那天的工作schedule
  };

  return (
    <View className="flex flex-row space-x-24 h-full items-center px-8">
      {isExpanded && (
        <>
          {/* <ScrollView
            automaticallyAdjustContentInsets={false}
            horizontal={true}
            className="space-x-4"
            style={{ borderRadius: 16 }}
          > */}
          <Calendar
            markingType={"period"}
            markedDates={tripDates}
            onDayPress={onDayPress}
            style={{
              height: "90%",
              width: 400,
              backgroundColor: "white",
              borderRadius: 20,
            }}
            theme={{
              calendarBackground: "#ffffff",
            }}
          />

          {showFlatList && selectedDate && (
            <FlatList
              data={eventsData[selectedDate]}
              keyExtractor={(item) => item.time}
              renderItem={({ item }) => (
                //<Agenda/>
                <View className="mb-4 px-2 py-2 bg-white rounded-lg">
                  <Text className="text-center text-2xl">{item.time}</Text>

                  <View className="flex flex-row space-x-12">
                    <Text className="text-xl">{item.job}</Text>
                    <Pressable className="bg-blue-400 px-3 rounded-full  py-2 border-1 border-black p-2 w-1/5">
                      <Text className="text-white ">簽到</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          )}
          {/* </ScrollView> */}
        </>
      )}
    </View>
  );
};

export default ExpandableCalendar;
