import { Pressable, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Button, List } from "react-native-paper";
import { useState } from "react";
import TripInfo from "@/components/TripInfo";
import RegisterTrip from "../RegisterTrip";
import Table from "../TableComponents";
import Info from "../Info";
import Rollcall from "../ongoing/Rollcall";
import { DocumentData } from "firebase/firestore";

interface InfoButtonProps {
  expanded: boolean;
  handleExpand: (expanded: boolean) => void;
  captainName: string;
  tripName: string;
  trips: DocumentData;
}

const InfoButton = ({
  expanded,
  captainName,
  handleExpand,
  tripName,
  trips,
}: InfoButtonProps) => {
  const [showTripInfo, setShowTripInfo] = useState(false);
  const [showRollCall, setShowRollCall] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      {expanded && (
        <View className="py-2">
          <List.Section>
            <List.Accordion
              title={"test"}
              left={(props) => <List.Icon {...props} icon="account" />}
            >
              <List.Item
                title={"Trip Info"}
                onPress={() => setShowTripInfo(true)}
                className={"w-full p-2 bg-white"}
              />
              <List.Item
                title={"Roll Call"}
                onPress={() => setShowRollCall(true)}
                className={"w-full p-2 bg-white"}
              />
              <List.Item
                title={"Details"}
                onPress={() => setShowDetails(true)}
                className={"w-full p-2 bg-white"}
              />
              <List.Item
                title={"Edit"}
                onPress={() => setShowEdit(true)}
                className={"w-full p-2 bg-white"}
              />
            </List.Accordion>
          </List.Section>
          <Info
            name={tripName}
            show={showTripInfo}
            trips={trips}
            handleShow={(showModal: boolean) => setShowTripInfo(showModal)}
          />
          {/* <TripInfo /> */}

          <Rollcall
            show={showRollCall}
            handleShow={(showModal: boolean) => setShowRollCall(showModal)}
          />

          <Table
            show={showDetails}
            handleShow={(showModal: boolean) => setShowDetails(showModal)}
          />

          <RegisterTrip
            show={showEdit}
            handleShow={setShowEdit}
            captainName={captainName}
          />
        </View>
      )}
      <Button onPress={() => handleExpand(expanded)}>
        <Entypo name="info-with-circle" size={20} color="black" />
      </Button>
    </>
  );
};

export default InfoButton;
