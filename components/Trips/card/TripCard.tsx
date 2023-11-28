import { useState } from "react";
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

const getProgress = (startDate: Date, endDate: Date) => {
  const millisecondsDiff = new Date().getTime() - startDate.getTime();
  if (millisecondsDiff < 0) return 0; // Trip hasn't started yet
  const interval = endDate.getTime() - startDate.getTime();
  const progress = millisecondsDiff / interval;
  return progress;
};

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
  const progress = getProgress(new Date(tripFrom), new Date(tripEnd));

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
            <InfoButton
              expanded={expanded}
              handleExpand={(expanded: boolean) => setExpanded(!expanded)}
              captainName={captainName}
              tripName={tripName}
            />
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
          <ProgressBar progress={progress} color={"blue"} />
        </Card.Content>
      </Card>
    </View>
  );
};

export default TripCard;
