import { useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Redirect } from "expo-router";

const Home = () => {
  useEffect(() => {
    // TODO make into a react context provider
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    return unsubscribe();
  }, []);

  return <Redirect href={`/(auth)/SignIn`} />;
};

export default Home;
