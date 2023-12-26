import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { styled } from "nativewind";
import AddTripButton from "@/components/trips/AddTripButton";
import TripCard from "@/components/trips/card/TripCard";
import { useEffect, useState, useCallback } from "react";
import { Timestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import RegisterTrip from "@/components/trips/RegisterTrip";
import { useGetCollectionContext } from "@/context/getCollectionContext";
import { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Trip {
  id: string;
  password: string;
}

const History = () => {
  //! somehow local storage can't get all trip data
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [pastTrips, setPastTrips] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadHistory, setIsLoadHistory] = useState(false);

  const {
    userLoading: loading,
    currentUserData: data,
    currentAuth,
  } = useGetCollectionContext();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    setIsLoadHistory(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const tooOldTrips: string[] = [];
    setPastTrips(
      data?.trips
        ?.filter(
          (trip: any) =>
            new Timestamp(
              trip.start_date.seconds,
              trip.start_date.nanoseconds
            ).toDate() < new Date() &&
            new Timestamp(
              trip.end_date.seconds,
              trip.end_date.nanoseconds
            ).toDate() < new Date()
        )
        .map((trip: any) => {
          if (
            thirtyDaysAgo.getTime() >
            new Timestamp(trip.end_date.seconds, trip.end_date.nanoseconds)
              .toDate()
              .getTime()
          ) {
            tooOldTrips.push(trip.id);
          }
          return trip.id;
        })
    );
    const updateNewTrips = async (tooOldTrips: string[]) => {
      await updateDoc(doc(db, "users", currentAuth?.uid!), {
        trips: data?.trips.filter(
          (trip: any) => !tooOldTrips.includes(trip.id)
        ),
      });
      const userRef = await AsyncStorage.getItem("users_" + currentAuth?.uid!);
      const user = JSON.parse(userRef!);
      await AsyncStorage.setItem(
        "users_" + currentAuth?.uid!,
        JSON.stringify({
          ...user,
          trips: data?.trips.filter(
            (trip: any) => !tooOldTrips.includes(trip.id)
          ),
        })
      );
      setIsLoadHistory(false);
    };

    if (tooOldTrips.length !== 0) {
      Promise.all(
        tooOldTrips.map(async (trip: any) => {
          await deleteDoc(doc(db, "trips", trip.id));
          await AsyncStorage.removeItem("trips_" + trip.id);
        })
      );
      updateNewTrips(tooOldTrips);
    } else setIsLoadHistory(false);
  }, [data]);

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
          <View className="border-b-4 dark:border-white">
            <Text className="font-extrabold text-4xl py-4 dark:text-white ">
              History:{" "}
            </Text>
          </View>
          {loading || loadHistory ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row flex-wrap items-start justify-start">
              {pastTrips?.length > 0 ? (
                pastTrips.map((tripId) => (
                  <TripCard tripId={tripId} key={tripId} isOngoing={false} />
                ))
              ) : (
                <Text className="dark:text-white text-right text-lg">
                  No Past Trips
                </Text>
              )}
            </View>
          )}
        </View>
        {/*<View className="p-3 w-60 h-60">
          <Pressable className="m-0" onPress={() => setShowModal(true)}>
            <View className="bg-transparent rounded-2xl flex-1 p-4 w-60 py-8">
              <View className="border-dashed border-4 dark:border-white p-20 rounded-2xl h-56 w-56">
                <View className="flex flex-col items-center justify-center h-full">
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

export default History;
