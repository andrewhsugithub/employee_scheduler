import { View, SafeAreaView, Text, Pressable } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import JobScheduler from "../../components/JobScheduler";
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils,
} from "react-native-calendars";

const Info = () => {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Text className="text-center font-bold text-2xl">
        {params.trip_id} Info
      </Text>
      <Text className="font-medium text-lg">Captain: 王大明</Text>
      <Text>Calendar: </Text>
    </SafeAreaView>
  );
};

export default Info;
