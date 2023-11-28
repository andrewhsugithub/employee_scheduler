import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { List } from "react-native-paper";
import { Controller, set, useFieldArray, useForm } from "react-hook-form";
import JobForm from "@/components/JobForm";
import Carousel from "@/components/Carousel";
import { useState } from "react";
import { getAuth } from "firebase/auth";

// TODO turn into realtime database and make sure referential integrity

interface AddJobPageProps {
  control: any;
  errors: any;
  crewArray: any;
}

const AddJobPage = ({ control, errors, crewArray }: AddJobPageProps) => {
  const captain = getAuth().currentUser?.displayName;
  const captainId = getAuth().currentUser?.uid;
  const crewNames = [
    { name: captain, id: captainId },
    ...crewArray.map((crew: any) => {
      return {
        name: crew.crew_name,
        id: crew.id,
      };
    }),
  ];
  // console.log("crewNames: ", crewNames);

  const [selectedCrewName, setSelectedCrewName] = useState(captain);
  const [expanded, setExpanded] = useState(true);
  const [crewId, setCrewId] = useState(captainId);
  const [crewIndex, setCrewIndex] = useState(0);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View className="bg-slate-100 rounded-3xl p-3 m-8 h-640">
      <List.Section title="Crew Names">
        <List.Accordion
          title={`${selectedCrewName}`}
          left={(props) => <List.Icon {...props} icon="folder" />}
          expanded={expanded}
          onPress={handlePress}
        >
          {crewNames.map((crew: { name: string; id: string }, index: any) => (
            <List.Item
              title={crew.name}
              key={crew.id}
              onPress={() => {
                setSelectedCrewName(crew.name);
                setCrewId(crew.id);
                setCrewIndex(index - 1);
              }}
              className={`${
                selectedCrewName === crew.name ? "bg-slate-500" : ""
              }`}
            />
          ))}
        </List.Accordion>
      </List.Section>
      <JobForm
        crewId={crewId!}
        control={control}
        errors={errors}
        crewIndex={crewIndex}
      />
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
    </View>
  );
};

export default AddJobPage;
