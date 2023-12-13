import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

interface ExpandableCalendarProps {
  // 添加其他需要的属性
}

const ExpandableCalendar: React.FC<ExpandableCalendarProps> = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [showFlatList, setShowFlatList] = useState(false);

  const [markedDates, setMarkedDates] = useState({
    "2023-12-02": {
      startingDates: true,
      selected: true,
      marked: true,
      selectedColor: "red",
      color: "red",
    },
    "2023-12-03": {
      selected: true,
      marked: true,
      selectedColor: "red",
      color: "red",
    },
    "2023-12-04": {
      disabled: true,
      marked: true,
      selected: true,
      selectedColor: "blue",
      color: "red",
      endingDates: true,
    },
    //這裡放此trip包含哪幾天
  });

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
          <ScrollView
            automaticallyAdjustContentInsets={false}
            horizontal={true}
            className="bg-white"
          >
            <Calendar
              markingType={"period"}
              markedDates={markedDates}
              onDayPress={onDayPress}
              style={{
                height: "90%",
                width: 400,
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
                  <View className="bg-blue-200 px-2 py-2 mb-4 rounded-2xl ">
                    <Text className="text-center">{item.time}</Text>
                    <Text className="text-center">{item.job}</Text>
                  </View>
                )}
              />
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default ExpandableCalendar;
