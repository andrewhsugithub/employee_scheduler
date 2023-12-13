import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Pressable, Text, View, StyleSheet } from "react-native";
import DrawerProfile from "./DrawerProfile";

const DrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView
      {...props}
      className="flex flex-col h-screen place-content-between "
      scrollEnabled={false}
    >
      <View className="place-content-between h-screen pb-6">
        <View>
          <Text className="text-3xl p-3 bg-slate-200 ">Trips</Text>
          <DrawerItemList {...props} />
        </View>

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <DrawerProfile />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
