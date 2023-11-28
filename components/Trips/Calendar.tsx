import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

interface ExpandableCalendarProps {
  // 添加其他需要的属性
}

const ExpandableCalendar: React.FC<ExpandableCalendarProps> = () => {
  const [isExpanded, setIsExpanded] = useState(true);

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

  const eventsData = [
    { time: "1:00 A.M. ~ 3:00 A.M.", job: "捕魚" },
    { time: "7:00 P.M. ~ 9:00 P.M.", job: "殺魚" },
    //舉例的假資料
  ];

  return (
    <View
      //style={styles.container}
      className="flex flex-row space-x-12 h-4/5"
    >
      {isExpanded && (
        <>
          <Calendar
            className="w-full"
            onDayPress={(day) => {
              console.log("selected day", day);
              // 選日期
            }}
          />
          <View className="w-2/5">
            <Text
              className="mb-2 text-center font-bold"
              //style={styles.eventsHeader}
            >
              Working schedule
            </Text>
            <FlatList
              data={eventsData}
              keyExtractor={(item) => item.time}
              renderItem={({ item }) => (
                <View
                  //style={styles.eventItem}
                  className="bg-blue-200 px-2 py-2 mb-4 rounded-2xl w-4/5 "
                >
                  <Text className="text-center">{item.time}</Text>
                  <Text className="text-center">{item.job}</Text>
                </View>
              )}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ExpandableCalendar;
