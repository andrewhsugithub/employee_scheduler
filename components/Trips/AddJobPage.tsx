import { View, useColorScheme } from "react-native";
import { List } from "react-native-paper";
import JobForm from "@/components/JobForm";
import { useState } from "react";
import { useGetCollectionContext } from "@/context/getCollectionContext";
import { Control, FieldErrors, FieldValues } from "react-hook-form";

// TODO turn into realtime database and make sure referential integrity

interface User {
  name: string;
  id: string;
}

interface AddJobPageProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  crewArray: any;
  users: User[];
}

const AddJobPage = <T extends FieldValues>({
  control,
  errors,
  crewArray,
  users,
}: AddJobPageProps<T>) => {
  const colorScheme = useColorScheme();
  const { currentAuth } = useGetCollectionContext();

  const captain = currentAuth?.displayName;
  const captainId = currentAuth?.uid;
  const crewNames = [
    { name: captain!, id: captainId! } as User,
    ...users.reduce((acc: User[], user: User) => {
      if (crewArray.findIndex((item: any) => item.crew_id === user.id) >= 0) {
        acc.push({
          name: user.name!,
          id: user.id!,
        });
      }
      return acc;
    }, []),
  ];
  // console.log("crewNames: ", crewNames);

  const [selectedCrewName, setSelectedCrewName] = useState(captain);
  const [expanded, setExpanded] = useState(false);
  const [crewId, setCrewId] = useState(captainId!);
  // const [crewIndex, setCrewIndex] = useState(0);

  const handlePress = () => setExpanded(!expanded);

  return (
    // <View className="bg-slate-100 rounded-3xl p-3 m-8 h-640">
    <View className="flex p-3">
      {/* <ScrollView className="h-500"> */}
      <List.Section
        title="Crew Names"
        className="z-50"
        titleStyle={{ color: `${colorScheme === "dark" ? "white" : ""}` }}
      >
        <List.Accordion
          title={`${selectedCrewName}`}
          left={(props) => <List.Icon {...props} icon="account" />}
          expanded={expanded}
          onPress={handlePress}
          // style={{ position: "relative" }}
        >
          {crewNames.map(
            (crew: { name: string; id: string }, index: number) => (
              <List.Item
                title={crew.name}
                key={crew.id}
                onPress={() => {
                  setSelectedCrewName(crew.name);
                  setCrewId(crew.id);
                  setExpanded(!expanded);
                  // setCrewIndex(index - 1);
                }}
                left={(props) => <List.Icon {...props} icon="account" />}
                style={{ position: "absolute", top: index * 52 }}
                className={`w-full p-2 ${
                  selectedCrewName === crew.name ? "bg-slate-500 " : "bg-white"
                }`}
              />
            )
          )}
        </List.Accordion>
      </List.Section>
      {/* <View className="mt-10"> */}
      {crewNames.map((crew: { name: string; id: string }, index: any) => (
        <View key={crew.id}>
          {crew.id === crewId && (
            <JobForm
              crewId={crew.id}
              control={control}
              errors={errors}
              crewIndex={index - 1}
            />
          )}
        </View>
      ))}
      {/* </View> */}
      {/*
        <Picker
          className="items-right"
          selectedValue={selectedJobList}
          onValueChange={(jobList, jobIndex) => setSelectedJobList(jobList)}
        >
          {jobList.map((jobList) => (
            <Picker.Item label={jobList} value={jobList} />
          ))}
        </Picker>
          */}
      {/* {<Carousel control={control} errors={errors} />} */}
      {/* </ScrollView> */}
      {/* </ScrollView> */}
      {/* </View> */}
    </View>
  );
};

export default AddJobPage;
