import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import { styled } from "nativewind";
import TripInfo from "../../components/TripInfo";

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

const CrewMember = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView>
      <Text className="bg-pink-600 p-3 font-bold text-white">
        Hello {params.employee_id}
      </Text>
      <TripInfo />
      <Text>Your schedule in next trip: </Text>
      <Text>Your schedule in next trip: </Text>
      <View className="flex items-center">
        <StyledPressable className="bg-red-600 active:bg-blue-300 p-3 rounded-2xl">
          <StyledText className="text-center uppercase active:text-white">
            Call for help!
          </StyledText>
        </StyledPressable>
      </View>
    </SafeAreaView>
  );
};

export default CrewMember;
