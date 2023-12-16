import { Pressable, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Button } from "react-native-paper";

interface InfoButtonProps {
  expanded: boolean;
  handleExpand: (expanded: boolean) => void;
  handleShowTripInfo: (showModal: boolean) => void;
  handleShowRollCall: (showModal: boolean) => void;
  handleShowDetails: (showModal: boolean) => void;
  handleShowEdit: (showModal: boolean) => void;
  isOngoing: boolean;
}

const InfoButton = ({
  expanded,
  handleExpand,
  handleShowTripInfo,
  handleShowRollCall,
  handleShowDetails,
  handleShowEdit,
  isOngoing,
}: InfoButtonProps) => {
  return (
    <>
      <Button onPress={() => handleExpand(!expanded)}>
        <Entypo name="info-with-circle" size={20} color="black" />
      </Button>
      {expanded && (
        <View className="p-2 rounded-xl bg-black opacity-70 absolute -left-24 right-12 flex flex-col justify-between ">
          <Pressable
            onPress={() => handleShowTripInfo(true)}
            className={"border-b-2 border-b-white"}
          >
            <View className="flex flex-row justify-between items-center m-2 mr-4">
              <Text className="text-white w-full">Trip Info</Text>
              <Entypo name="info-with-circle" size={15} color="white" />
            </View>
          </Pressable>
          {isOngoing && (
            <>
              <Pressable
                onPress={() => handleShowRollCall(true)}
                className={"border-b-2 border-b-white"}
              >
                <View className="flex flex-row justify-between items-center m-2 mr-4">
                  <Text className="text-white w-full">Roll Call</Text>
                  <Entypo name="info-with-circle" size={15} color="white" />
                </View>
              </Pressable>
              <Pressable
                onPress={() => handleShowDetails(true)}
                className={"border-b-2 border-b-white"}
              >
                <View className="flex flex-row justify-between items-center m-2 mr-4">
                  <Text className="text-white w-full">Details</Text>
                  <Entypo name="info-with-circle" size={15} color="white" />
                </View>
              </Pressable>
            </>
          )}
          <Pressable
            onPress={() => handleShowEdit(true)}
            className={"border-b-2 border-b-white"}
          >
            <View className="flex flex-row justify-between items-center m-2 mr-4">
              <Text className="text-white w-full">Edit</Text>
              <Entypo name="info-with-circle" size={15} color="white" />
            </View>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default InfoButton;
