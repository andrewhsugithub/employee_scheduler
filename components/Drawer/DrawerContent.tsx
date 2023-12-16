import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import DrawerProfile from "./DrawerProfile";

const DrawerContent = (props: DrawerContentComponentProps) => {
  const colorScheme = useColorScheme();

  return (
    <DrawerContentScrollView
      {...props}
      className="flex flex-col h-screen place-content-between "
      scrollEnabled={false}
    >
      <View
        className={`place-content-between h-screen pb-6  ${
          colorScheme === "dark" ? "" : "bg-slate-100"
        }`}
      >
        <View>
          <Text
            className={`text-3xl p-3 dark:text-white ${
              colorScheme === "dark" ? "" : "bg-slate-200"
            }`}
          >
            Trips
          </Text>
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
