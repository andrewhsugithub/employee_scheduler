import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Pressable, Text } from "react-native";
import DrawerProfile from "./DrawerProfile";

const DrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props} className="flex flex-col h-screen">
      <Text className="text-3xl p-3 bg-slate-200 ">Trips</Text>
      <DrawerItemList {...props} />
      <DrawerProfile />
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
