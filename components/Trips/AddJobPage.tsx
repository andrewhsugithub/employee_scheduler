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
import { Controller, useForm } from "react-hook-form";
import JobForm from "@/components/JobForm";
import Carousel from "@/components/Carousel";
import { Picker } from "@react-native-picker/picker";

// TODO turn into realtime database and make sure referential integrity
const AddJobPage = () => {
  return (
    <View className="bg-slate-100 rounded-3xl p-3 m-8 h-32">
      <Text className="text-2xl text-black font-extrabold">
        Do dropdown menu to pick crew member with Picker or
        react-native-dropdown-picker
      </Text>
      {/* 
                <JobForm role="captain" control={control} errors={errors} />
                <Carousel control={control} errors={errors} /> */}
    </View>
  );
};

export default AddJobPage;
