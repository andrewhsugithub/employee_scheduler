import { Pressable, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { useState } from "react";
import TripInfo from "@/components/TripInfo";
import RegisterTrip from "../RegisterTrip";
import Info from "../Info";
import Rollcall from "../ongoing/Rollcall";

interface InfoButtonProps {
  expanded: boolean;
  handleExpand: (expanded: boolean) => void;
  captainName: string;
  tripName: string;
}

const InfoButton = ({
  expanded,
  captainName,
  handleExpand,
  tripName,
}: InfoButtonProps) => {
  const [showTripInfo, setShowTripInfo] = useState(false);
  const [showRollCall, setShowRollCall] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      {expanded && (
        <View className="py-2">
          <View className="flex items-center space-y-1">
            <Pressable
              onPress={() => setShowTripInfo(true)}
              className="bg-blue-300 px-7 rounded-xl py-2 border-2 border-blue-700 p-2"
            >
              <Text>Trip Info</Text>
              <Info
                name={tripName}
                show={showTripInfo}
                handleShow={(showModal: boolean) => setShowTripInfo(showModal)}
              />
            </Pressable>
            <Pressable
              onPress={() => setShowRollCall(true)}
              className="bg-blue-300 px-7 rounded-xl py-2 border-2 border-blue-700 p-2"
            >
              {/* <TripInfo /> */}
              <Text>Roll Call</Text>
              <Rollcall
                show={showRollCall}
                handleShow={(showModal: boolean) => setShowRollCall(showModal)}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setShowEdit(true);
              }}
              className="bg-blue-300 px-7 rounded-xl py-4 border-2 border-blue-700 p-2"
            >
              <Text>Edit</Text>
              <RegisterTrip
                show={showEdit}
                handleShow={setShowEdit}
                captainName={captainName}
              />
            </Pressable>
          </View>
        </View>
      )}
      <Button onPress={() => handleExpand(expanded)}>
        <Entypo name="info-with-circle" size={20} color="black" />
      </Button>
    </>
  );
};

export default InfoButton;
