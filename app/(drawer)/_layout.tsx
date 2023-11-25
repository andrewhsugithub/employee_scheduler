import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions, DrawerStatus } from "@react-navigation/native";
import { Text, Pressable, StyleProp, ViewStyle } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Feather } from "@expo/vector-icons";
import DrawerContent from "@/components/Drawer/DrawerContent";

export default function DrawerLayout() {
  const router = useRouter();
  const navigate = useNavigation();
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>(1);
  const [drawerStatus, setDrawerStatus] = useState<DrawerStatus>();
  const [drawerType, setDrawerType] = useState<
    "front" | "slide" | "back" | "permanent" | undefined
  >();
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
        console.log("hi");
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

  const handleLogout = () => {
    router.push("/(auth)/SignIn");
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        overlayColor: orientation >= 3 ? "transparent" : "rgba(0,0,0,0.5)",
        drawerType: drawerType,
        headerLeft: () => (
          <Pressable onPress={onPressHandler} className="m-2">
            <Feather name="sidebar" size={28} color="black" />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable className="m-2" onPress={handleLogout}>
            <Feather name="log-out" size={28} color="black" />
          </Pressable>
        ),
      }}
      defaultStatus="open"
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="[employee_id]/MyTrips"
        options={{
          drawerLabel: "Home",
          title: "My Trips",
        }}
      />
      <Drawer.Screen
        name="[employee_id]/AcceptTrips"
        options={{
          drawerLabel: "Accept",
          title: "Accept Trips Page",
        }}
      />
    </Drawer>
  );
}
