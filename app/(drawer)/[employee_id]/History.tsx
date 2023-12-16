import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import AddTripButton from "@/components/trips/AddTripButton";
import TripCard from "@/components/trips/card/TripCard";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import RegisterTrip from "@/components/trips/RegisterTrip";
import useFetch from "@/hooks/useFetch";

const History = () => {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const [pastTrips, setPastTrips] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const captainId = getAuth().currentUser?.uid;

  const { loading, data } = useFetch(doc(db, "users", captainId!));

  useEffect(() => {
    setPastTrips(
      data?.trips
        ?.filter((trip: any) => trip.end_date.toDate() < new Date())
        .map((trip: any) => trip.id)
    );
  }, [data]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-3">
          <View className="border-b-8 dark:border-white">
            <Text className="font-extrabold text-4xl py-4 dark:text-white ">
              History:{" "}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row flex-wrap">
              {pastTrips?.map((tripId) => (
                <TripCard tripId={tripId} key={tripId} isOngoing={false} />
              ))}
              <Pressable className="m-8" onPress={() => setShowModal(true)}>
                <View className="bg-transparent rounded-2xl flex-1 p-4 w-full">
                  <View className="border-dashed border-8 dark:border-white p-20 rounded-2xl h-full">
                    <View className="flex flex-col items-center justify-evenly h-full">
                      <Text className="font-black text-7xl dark:text-white">
                        +
                      </Text>
                      <Text className="font-black text-2xl dark:text-white">
                        ADD
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      <AddTripButton captainName={params.employee_id as string} />
      <RegisterTrip
        show={showModal}
        handleShow={(showModal: boolean) => setShowModal(showModal)}
      />
    </SafeAreaView>
  );
};

export default History;
