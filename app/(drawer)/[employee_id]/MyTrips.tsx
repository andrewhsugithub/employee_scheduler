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
import TripInfo from "@/components/TripInfo";
import AddTripButton from "@/components/Trips/AddTripButton";
import TripCard from "@/components/Trips/TripCard";

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
              />
            ))}
          </View>
          {/* <FlatList
            className="py-4"
            data={trips}
            renderItem={({ item }) => (
              
            )}
            horizontal
            // className="bg-slate-200 p-4"
          /> */}
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
              />
            ))}
          </View>
        </View>
        {/* <Text>Your schedule in this trip: </Text>
      <Text>Your schedule in next trip: </Text>
      <View className="flex items-center">
        <StyledPressable className="bg-red-600 active:bg-blue-300 p-3 rounded-2xl">
          <StyledText className="text-center uppercase active:text-white">
            Call for help!
          </StyledText>
        </StyledPressable>
      </View>
       */}
      </ScrollView>
      <AddTripButton captainName={params.employee_id as string} />
    </SafeAreaView>
  );
};

export default CrewMember;
