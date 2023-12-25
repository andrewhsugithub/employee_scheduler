import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  FlatList,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AddTripButton from "@/components/trips/AddTripButton";
import TripCard from "@/components/trips/card/TripCard";
import { useEffect, useState, useCallback } from "react";
import RegisterTrip from "@/components/trips/RegisterTrip";
import { Timestamp } from "firebase/firestore";
import { useGetCollectionContext } from "@/context/getCollectionContext";

const CrewMember = () => {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [ongoingTrips, setOngoingTrips] = useState<string[]>([]);
  const [futureTrips, setFutureTrips] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const { userLoading: loadTrips, currentUserData: allTrips } =
    useGetCollectionContext();

  useEffect(() => {
    allTrips?.trips?.sort((a: any, b: any) => {
      const startDateA = new Timestamp(
        a.start_date.seconds,
        a.start_date.nanoseconds
      ).toDate();
      const startDateB = new Timestamp(
        b.start_date.seconds,
        b.start_date.nanoseconds
      ).toDate();
      return startDateA.getTime() - startDateB.getTime();
    });

    setOngoingTrips(
      allTrips?.trips
        ?.filter(
          (trip: any) =>
            new Timestamp(
              trip.start_date.seconds,
              trip.start_date.nanoseconds
            ).toDate() <= new Date() &&
            new Timestamp(
              trip.end_date.seconds,
              trip.end_date.nanoseconds
            ).toDate() >= new Date()
        )
        .map((trip: any) => trip.id)
    );
    setFutureTrips(
      allTrips?.trips
        ?.filter(
          (trip: any) =>
            new Timestamp(
              trip.start_date.seconds,
              trip.start_date.nanoseconds
            ).toDate() > new Date()
        )
        .map((trip: any) => trip.id)
    );
  }, [allTrips]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="dark:text-white text-center text-lg">
          Pull to refresh
        </Text>
        <View className="p-3">
          <View className="border-b-4 dark:border-white py-2">
            {/* <View className="bg-blue-100 w-1/5 rounded-3xl"> */}
            <Text className="font-extrabold text-3xl py-4 dark:text-white ">
              Ongoing:{" "}
            </Text>
            {/* </View> */}
          </View>
          {loadTrips ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row flex-wrap">
              {ongoingTrips?.length > 0 ? (
                <>
                  {ongoingTrips?.map((tripId) => (
                    <TripCard tripId={tripId} key={tripId} isOngoing={true} />
                  ))}
                </>
              ) : (
                <Text className="dark:text-white text-left text-lg">
                  No Ongoing Trips
                </Text>
              )}
            </View>
          )}
        </View>
        <View className="p-3">
          <View className="border-b-4 dark:border-white py-2">
            {/* <View className="bg-blue-100 w-1/5 rounded-3xl"> */}
            <Text className="font-extrabold text-3xl py-4 dark:text-white ">
              Future:{" "}
            </Text>
            {/* </View> */}
          </View>
          {loadTrips ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row flex-wrap">
              {futureTrips?.length > 0 ? (
                futureTrips.map((tripId) => (
                  <TripCard tripId={tripId} key={tripId} isOngoing={false} />
                ))
              ) : (
                <Text className="dark:text-white text-left text-lg">
                  No Future Trips
                </Text>
              )}
            </View>
          )}
        </View>
        {/*<View className="p-3 w-60 h-60">
          <Pressable className="m-0" onPress={() => setShowModal(true)}>
            <View className="bg-transparent flex-1 p-4 w-60">
              <View className="border-dashed border-4 dark:border-white p-20 rounded-2xl h-56 w-56">
                <View className="flex flex-col items-center justify-start h-full">
                  <Text className="font-black text-5xl dark:text-white">+</Text>
                  <Text className="font-black text-base dark:text-white">
                    ADD
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </View>*/}
      </ScrollView>
      <AddTripButton captainName={params.employee_id as string} />
      <RegisterTrip
        show={showModal}
        handleShow={(showModal: boolean) => setShowModal(showModal)}
      />
    </SafeAreaView>
  );
};

export default CrewMember;
