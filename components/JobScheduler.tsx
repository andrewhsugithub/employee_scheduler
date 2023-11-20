import { SafeAreaView, Text, View } from "react-native";

const time = [1, 2, 3, 4, 5, 6, 7, 8];

const JobScheduler = () => {
  return (
    <SafeAreaView>
      <View className="flex flex-8">
        {time.map((t) => (
          <Text className="flex-1">{t}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default JobScheduler;
