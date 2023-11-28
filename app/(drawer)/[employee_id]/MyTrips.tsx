import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import AddTripButton from "@/components/trips/AddTripButton";
import TripCard from "@/components/trips/card/TripCard";

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

const trips = ["trip1", "trip2", "trip3", "trip4", "trip5"];

const CrewMember = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-3">
          <Text className="font-extrabold text-2xl py-4">Ongoing: </Text>
          <View className="flex-row flex-wrap">
            {trips.map((trip) => (
              <TripCard
                tripName="Hello"
                captainName="許榕安"
                tripFrom={new Date("2023-01-01T10:00:00").toISOString()}
                tripEnd={new Date().toISOString()}
                tripLocation="Taipei"
                isOngoing={true}
                // tripId={Math.random() * 100000 + ""}
                // key={trip.tripId}
              />
            ))}
          </View>
        </View>
        <View className="p-3">
          <Text className="font-extrabold text-2xl py-4">Future: </Text>
          <View className="flex-row flex-wrap">
            {trips.map((trip) => (
              <TripCard
                tripName="Hello"
                captainName="許榕安"
                tripFrom={new Date("2023-01-01T10:00:00").toISOString()}
                tripEnd={new Date().toISOString()}
                tripLocation="Taipei"
                isOngoing={true}
                // key={trip.tripId}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <AddTripButton captainName={params.employee_id as string} />
    </SafeAreaView>
  );
};

export default CrewMember;
