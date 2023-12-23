import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ConnectionType {
  connectionType: string;
  isConnected: boolean;
}

const CheckConnectionContext = createContext<ConnectionType | null>(null);

export const useCheckConnectionContext = () => {
  const context = useContext(CheckConnectionContext);
  if (!context) {
    throw new Error(
      "useCheckConnectionContext must be used within a CheckConnectionContextProvider"
    );
  }
  return context;
};

export const CheckConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState("");

  const hello = async () => {
    const user = await AsyncStorage.getItem("allUsers");
    const trip = await AsyncStorage.getItem("trips");
    const job = await AsyncStorage.getItem("jobs");
    console.log(
      "jobs\n",
      JSON.parse(job!),
      "\ntrips\n",
      JSON.parse(trip!),
      "\nusers\n",
      JSON.parse(user!)
    );
  };

  useEffect(() => {
    // TODO make into a react context provider
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      // hello();
      console.log(
        "connectionType: ",
        connectionType,
        "isConnected: ",
        isConnected
      );
      // setIsConnected(state.isConnected!);
      setConnectionType(state.type!);
    });
    return () => unsubscribe();
  }, []);

  return (
    <CheckConnectionContext.Provider value={{ connectionType, isConnected }}>
      {children}
    </CheckConnectionContext.Provider>
  );
};
