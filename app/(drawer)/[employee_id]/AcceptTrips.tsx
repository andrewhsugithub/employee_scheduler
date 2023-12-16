import AddTripButton from "@/components/trips/AddTripButton";
import Info from "@/components/trips/Info";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { SafeAreaView, View, Text, Pressable, ScrollView } from "react-native";

const tripList = ["trip1", "trip2", "trip3", "trip4", "trip5"];

const AcceptTrips = () => {
  const [toggleModal, setToggleModal] = useState(false);
  const auth = getAuth();

  return (
    <SafeAreaView className="h-full ">
      <ScrollView>
        <View className=" py-8 items-center">
          <View className=" rounded-3xl bg-red-500 p-3 py-4 w-1/2 hower:w-full">
            <Text className="text-3xl text-center font-bold">
              ⚠️Your trips to verify⚠️
            </Text>
          </View>
        </View>

        {tripList.map((trip, index) => (
          <View className="flex flex-row justify-between items-center rounded-3xl p-10 m-8 border-4">
            <View className="flex flex-row justify-left items-center">
              <Text key={index} className="text-3xl p-3 font-bold">
                {`🛳️  ${trip}`} :
              </Text>
              <Pressable
                onPress={() => setToggleModal(true)}
                className="rounded-3xl bg-blue-500 p-2"
              >
                <Text className="text-xl">Info</Text>
              </Pressable>
              {/* <Info
                name={Math.random() * 100000 + ""}
                show={toggleModal}
                handleShow={(showModal: boolean) => setToggleModal(showModal)}
              /> */}
            </View>
            <View className="flex flex-row justify-end space-x-4">
              <Pressable className="rounded-3xl bg-green-500 p-2">
                <Text className="text-xl">Join</Text>
              </Pressable>
              <Pressable className="rounded-3xl bg-red-500 p-2">
                <Text className="text-xl">Reject</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcceptTrips;
