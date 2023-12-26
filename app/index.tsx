import { useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href={`/(auth)/SignIn`} />;
};

export default Home;
