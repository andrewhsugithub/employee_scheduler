﻿import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions, DrawerStatus } from "@react-navigation/native";
import {
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  View,
  useColorScheme,
  Modal,
  ScrollView,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import DrawerContent from "@/components/drawer/DrawerContent";
import { getAuth, signOut } from "firebase/auth";
import { Badge } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetCollectionProvider } from "@/context/getCollectionContext";
import Toast from "react-native-toast-message";

import { List } from "react-native-paper";

export default function DrawerLayout() {
  const auth = getAuth();
  const router = useRouter();
  const navigate = useNavigation();
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>(1);
  const [drawerStatus, setDrawerStatus] = useState<DrawerStatus>();
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(false);
  const [ShowNotification, setShowNotification] = useState(false);

  const [drawerType, setDrawerType] = useState<
    "front" | "slide" | "back" | "permanent" | undefined
  >();
  const colorScheme = useColorScheme();

  const NotificationMessage: string[] = ["Message1", "Message2", "Message3"];

  console.log("drawerType:", drawerType, "drawerStatus:", drawerStatus);

  const getOrientation = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    setOrientation(orientation);
    if (orientation! < 3) {
      navigate.dispatch(DrawerActions.closeDrawer());
      setDrawerStatus("closed");
      setDrawerType("front");
    } else setDrawerType("permanent");

    console.log(orientation);
  };

  useEffect(() => {
    getOrientation();
    const subscription = ScreenOrientation.addOrientationChangeListener((e) => {
      setOrientation(e.orientationInfo.orientation);
      if (e.orientationInfo.orientation < 3) {
        setDrawerStatus("closed");
        navigate.dispatch(DrawerActions.closeDrawer());
      }
      console.log(e.orientationInfo.orientation);
    });
    return () => ScreenOrientation.removeOrientationChangeListeners();
  }, []);

  const sleepForAnimation = async (ms: number, drawerStatus: string) => {
    console.log("sleeping");
    await new Promise((resolve) =>
      setTimeout(() => {
        console.log("sleep for ", ms);
        if ("open" === drawerStatus) setDrawerType("permanent");
        // else setDrawerType("slide");
        resolve;
      }, ms)
    );
  };

  useEffect(() => {
    console.log("use effect");
    if (drawerStatus === "open") {
      if (orientation! >= 3) sleepForAnimation(150, drawerStatus);
      else setDrawerType("front");
    } else {
      if (orientation! >= 3) sleepForAnimation(150, drawerStatus!);
      else setDrawerType("front");
    }
  }, [drawerStatus]);

  const onPressHandler = () => {
    console.log("pressed");
    if (drawerStatus === "open") {
      setDrawerType(orientation! < 3 ? "front" : "slide");
      navigate.dispatch(DrawerActions.closeDrawer());
    } else navigate.dispatch(DrawerActions.openDrawer());
    console.log("before toggle");
    setDrawerStatus(() => (drawerStatus === "open" ? "closed" : "open"));
  };

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.clear();
    router.push("/(auth)/SignIn");
  };

  const handleNotificationInbox = () => {
    setShowNotification(!ShowNotification);
  };

  return (
    <GetCollectionProvider>
      <Drawer
        screenOptions={{
          headerShown: true,
          overlayColor: orientation >= 3 ? "transparent" : "rgba(0,0,0,0.5)",
          drawerType: drawerType,
          headerLeft: () => (
            <Pressable onPress={onPressHandler} className="m-2">
              <Feather
                name="sidebar"
                size={28}
                color={`${colorScheme === "dark" ? "white" : "black"}`}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex flex-row">
              {/*<Pressable
                className="m-2"
                onPress={() => handleNotificationInbox()}
              >
                <Ionicons
                  name="notifications"
                  size={24}
                  color={`${colorScheme === "dark" ? "white" : "black"}`}
                />
                <Badge size={10} className="absolute z-40" />
              </Pressable>*/}
              {/*<List.Section
                title={"Notify"}
                className="z-50"
                titleStyle={{
                  color: `${colorScheme === "dark" ? "white" : ""}`,
                }}
              >*/}
              {/*<List.Accordion
                title=""
                left={(props) => (
                  <AntDesign name="bells" size={24} color="black" />
                )}
                expanded={ShowNotification}
                onPress={handleNotificationInbox}
                style={{ width: 60 }}
              >
                <View className="">
                  <ScrollView>
                    {NotificationMessage.map((str) => (
                      <List.Item
                        key={str}
                        title={str}
                        titleNumberOfLines={10}
                        onPress={handleNotificationInbox}
                        style={{ position: "relative" }}
                        className="bg-white w-100"
                      />
                    ))}
                  </ScrollView>
                </View>
                    </List.Accordion>*/}
              {/*</List.Section>*/}
              <Pressable className="m-2" onPress={handleLogout}>
                <Feather
                  name="log-out"
                  size={28}
                  color={`${colorScheme === "dark" ? "white" : "black"}`}
                />
              </Pressable>
            </View>
          ),
        }}
        defaultStatus="open"
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen
          name="[employee_id]/MyTrips"
          options={{
            drawerLabel: "Trips",
            title: "My Trips",
          }}
        />
        <Drawer.Screen
          name="[employee_id]/History"
          options={{
            drawerLabel: "History",
            title: "History Page",
          }}
        />
        <Drawer.Screen
          name="[employee_id]/Profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile Page",
          }}
        />
      </Drawer>
      <Toast position="top" />
    </GetCollectionProvider>
  );
}
