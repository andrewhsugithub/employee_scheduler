import { useState } from "react";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import TripInfo from "../TripInfo";
import { Pressable, View, Text } from "react-native";

interface TripCardProps {
  tripName: string;
  captainName: string;
  tripFrom: string;
  tripEnd: string;
  tripLocation: string;
  isOngoing: boolean;
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

const TripCard = ({
  tripName,
  captainName,
  tripFrom,
  tripEnd,
  tripLocation,
  isOngoing,
}: TripCardProps) => {
  const startDate = formatDate(tripFrom);
  const endDate = formatDate(tripEnd);
  const [expanded, setExpanded] = useState(false);
  const [showTripInfo, setShowTripInfo] = useState(false);
  const tripInterval = subtractDates(new Date(tripEnd), new Date(tripFrom));

  return (
    <View className="p-3 shadow-xl">
      <Card className="bg-blue-200">
        <View className="">
          <Card.Cover
            className="object-fit"
            source={{ uri: "https://picsum.photos/700" }}
          />
        </View>
        <Card.Title
          title={`Trip Name: ${tripName}`}
          subtitle={`Captain: ${captainName}`}
          right={() => (
            <>
              {expanded && (
                <View className="flex items-center">
                  <Pressable onPress={() => setShowTripInfo(true)}>
                    <Text>Trip Info</Text>
                    {/* {showTripInfo && <TripInfo />} */}
                  </Pressable>
                  <Pressable onPress={() => {}}>
                    {/* <TripInfo /> */}
                    <Text>Start Trip</Text>
                  </Pressable>
                  <Pressable onPress={() => {}}>
                    {/* <TripInfo /> */}
                    <Text>Edit</Text>
                  </Pressable>
                </View>
              )}
              <Button onPress={() => setExpanded(!expanded)}>
                <Entypo name="info-with-circle" size={20} color="black" />
              </Button>
            </>
          )}
        />
        <Card.Content>
          <Paragraph className="text-slate-500">Start: {startDate}</Paragraph>
          <Paragraph className="text-slate-500">End: {endDate}</Paragraph>
          <Paragraph className="text-slate-500">
            Interval: {tripInterval}
          </Paragraph>
          <Paragraph className="text-slate-500">
            Location: {tripLocation}
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

export default TripCard;
