import { SafeAreaView, View, Text, Pressable } from "react-native";
import { Stack } from "expo-router";

const Register = () => {
  const registerTrip = () => {
    // TODO: make sure your boss verifies your trip, so send this form to your boss via email or ...
  };

  return (
    <SafeAreaView>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}
      <Text>Register Form</Text>
      <Text>Boss:</Text>
      <Text>Captain:</Text>
      <Text>Job Schedule for captain: </Text>
      <Text>Crew #1:</Text>
      <Text>Job Schedule for crew #1: </Text>
      <Pressable
        className="bg-green-500 rounded-2xl p-5"
        onPress={registerTrip}
      >
        <Text>Register</Text>
      </Pressable>
      <Text>
        See email for QR Code and verification code if register succeeds Note:
        you and your crew will also receive push notifications (see
        /employee_id/verify to verify) and email and sms? if register succeeds
      </Text>
    </SafeAreaView>
  );
};

export default Register;
