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
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import { DocumentReference, doc, getDoc, onSnapshot } from "firebase/firestore";

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

const CrewMember = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [trips, setTrips] = useState<string[]>([]);
  const [ongoingTrips, setOngoingTrips] = useState<string[]>([]);
  const [futureTrips, setFutureTrips] = useState<string[]>([]);
  const captainId = getAuth().currentUser?.uid;

  const getInitData = async (ref: DocumentReference) => {
    const userDoc = await getDoc(ref);
    setTrips(userDoc.data()?.trips.map((trip: any) => trip.id));
  };

  useEffect(() => {
    const userRef = doc(db, "users", captainId!);
    getInitData(userRef);

    const unsubscribe = onSnapshot(
      userRef,
      { includeMetadataChanges: true },
      (userDoc) => {
        setTrips(userDoc.data()?.trips.map((trip: any) => trip.id));
        console.log("trips: ", userDoc.data()?.trips);
      }
    );
    return unsubscribe();
  }, []);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="p-3">
          <Text className="font-extrabold text-2xl py-4">Ongoing: </Text>
          <View className="flex-row flex-wrap">
            {trips?.map((tripId) => (
              <TripCard tripId={tripId} key={tripId} />
            ))}
          </View>
        </View>
        <View className="p-3">
          <Text className="font-extrabold text-2xl py-4">Future: </Text>
          <View className="flex-row flex-wrap">
            {trips?.map((tripId) => (
              <TripCard tripId={tripId} key={tripId} />
            ))}
          </View>
        </View>
      </ScrollView>
      <AddTripButton captainName={params.employee_id as string} />
    </SafeAreaView>
  );
};

export default CrewMember;
