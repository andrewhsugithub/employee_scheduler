import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

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

  useEffect(() => {
    // TODO make into a react context provider
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected!);
      setConnectionType(state.type!);
    });
    return unsubscribe();
  }, []);

  return (
    <CheckConnectionContext.Provider value={{ connectionType, isConnected }}>
      {children}
    </CheckConnectionContext.Provider>
  );
};
