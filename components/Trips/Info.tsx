import {
  View,
  SafeAreaView,
  Text,
  Pressable,
  Modal,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DocumentData } from "firebase/firestore";
import {
  JobSchema,
  type JobFormSchema,
} from "@/lib/validations/registerSchema";
import Schedule from "./card/Info/Schedule";
import { Divider, List, Searchbar, TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useGetCollectionContext } from "@/context/getCollectionContext";

interface TripProps {
  name: string;
  show: boolean;
  handleShow: (showModal: boolean) => void;
  trips: DocumentData;
  crew: User[];
}

const Info = ({ name, show, handleShow, trips, crew }: TripProps) => {
  const { currentAuth: auth } = useGetCollectionContext();
  const colorSheme = useColorScheme();
  const [selectedCrew, setSelectedCrew] = useState<User>({
    id: auth?.uid!,
    name: auth?.displayName!,
  });
  const [showCrewList, setShowCrewList] = useState(false);
  const [searchQuery, setSearchQuery] = useState(auth?.displayName!);
  const [filteredCrew, setFilteredCrew] = useState<User[]>(crew);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredCrew(
      crew.filter((user: User) => user.name.toLowerCase().includes(query))
    );
    // if (filteredCrew.length == 0) setSearchQuery(selectedCrew.name);
  };

  const onFinishEdit = () => {
    setShowCrewList(false);
    if (filteredCrew.length == 0) setSearchQuery(selectedCrew.name);
    setFilteredCrew(crew);
    // setSearchQuery(selectedCrew.name);
  };

  return (
    <Modal animationType="slide" visible={show} presentationStyle="pageSheet">
      {/* <View
        className={`absolute bg-transparent z-10 right-0 left-0 top-0 bottom-0 flex-1 items-center justify-center`}
      > */}
      <View className={`p-10 bg-white dark:bg-slate-800 h-full`}>
        <Text className="text-center font-bold text-2xl dark:text-white py-2">
          Schedule
        </Text>
        <TextInput
          label="Selected Crew"
          onChangeText={onChangeSearch}
          value={searchQuery}
          left={<TextInput.Icon icon="account-search" />}
          // style={{
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
          onFocus={() => setShowCrewList(true)}
          // onPointerLeave={onFinishEdit}
          // onEndEditing={onFinishEdit}
          className="mx-12 z-40 rounded-2xl"
          underlineStyle={{ display: "none" }}
          // className="font-medium text-lg dark:text-white"
        />
        <View>
          {showCrewList && filteredCrew.length > 0 && (
            <ScrollView className="absolute left-14 p-2 bg-slate-200 flex-1 right-14 -top-4 -z-30 rounded-2xl h-44">
              {filteredCrew.map((user: User) => (
                <Pressable
                  onPress={() => {
                    console.log("pressed");
                    setSelectedCrew(user);
                    setSearchQuery(user.name);
                    onChangeSearch(user.name);
                    onFinishEdit();
                  }}
                  key={user.id}
                >
                  <List.Item
                    key={user.id}
                    title={user.name}
                    left={() => <List.Icon icon="account" />}
                    right={() => (
                      <List.Icon
                        icon={selectedCrew.id === user.id ? "check" : ""}
                      />
                    )}
                  />
                  <Divider />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        {crew.map((user: User) => (
          <View
            key={user.id}
            className={`${
              selectedCrew.id !== user.id ? "hidden" : ""
            }  h-full p-8 -z-50`}
          >
            <Schedule trip={trips!} crewId={user.id} />
          </View>
        ))}

        {/* <>
          <Text className="font-medium text-lg dark:text-white text-center p-3">
            Name: {auth?.displayName}
          </Text>
          <Schedule trip={trips!} crewId={auth?.uid!} />
        </> */}
      </View>
      <Pressable
        onPress={() => handleShow(false)}
        className="absolute top-2 right-2"
      >
        <MaterialIcons
          name="close"
          className="dark:text-white"
          size={22}
          color={`${colorSheme === "dark" ? "white" : "black"}`}
        />
      </Pressable>
      {/* </View> */}
    </Modal>
  );
};
export default Info;
