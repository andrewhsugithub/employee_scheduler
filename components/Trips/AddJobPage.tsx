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
import { Controller, set, useForm } from "react-hook-form";
import JobForm from "@/components/JobForm";
import Carousel from "@/components/Carousel";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

// TODO turn into realtime database and make sure referential integrity

const crewName = ["crew1", "crew2", "crew3", "crew4", "crew5"];
const jobList = ["job1", "job2", "job3", "job4", "job5"];

const AddJobPage = () => {
  const [selectedJobList, setSelectedJobList] = useState([]);
  const [selectedCrewName, setSelectedCrewName] = useState("");

  return (
    <View className="bg-slate-100 rounded-3xl p-3 m-8 h-640">
      <Picker
        className="items-left"
        selectedValue={selectedCrewName}
        onValueChange={(crewName, crewIndex) => setSelectedCrewName(crewName)}
      >
        {crewName.map((crew) => (
          <Picker.Item label={crew} value={crew} />
        ))}
      </Picker>

      <Picker
        className="items-right"
        selectedValue={selectedJobList}
        onValueChange={(jobList, jobIndex) => setSelectedJobList(jobList)}
      >
        {jobList.map((jobList) => (
          <Picker.Item label={jobList} value={jobList} />
        ))}
      </Picker>
      {/* 
                <JobForm role="captain" control={control} errors={errors} />
                <Carousel control={control} errors={errors} /> */}
    </View>
  );
};

export default AddJobPage;
