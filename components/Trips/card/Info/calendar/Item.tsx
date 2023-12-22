//! JOB CARD

import useFetch from "@/hooks/useFetch";
import { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DocumentReference,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  Button,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Dialog, Portal, PaperProvider, TextInput } from "react-native-paper";

interface ItemProps {
  item: {
    id?: string;
    password?: string;
  };
}

const AgendaItem = ({ item }: ItemProps) => {
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  if (Object.keys(item).length === 1) {
    return (
      <View className="pl-4 h-12 justify-center border-b-2 border-b-slate-400">
        <Text className="text-slate-400 text-sm">
          No Events Planned Today/Add Event
        </Text>
      </View>
    );
  }

  useEffect(() => {
    const timeId = setInterval(() => {
      setIsLate(
        checkIfLate(
          new Timestamp(
            data?.expected_starting_datetime.seconds,
            data?.expected_starting_datetime.nanoseconds
          ).toDate()
        ) && !checkIn
      );
      setIsOvertime(
        new Timestamp(
          data?.expected_ending_datetime.seconds,
          data?.expected_ending_datetime.nanoseconds
        ).toDate() && checkIn
      );
    }, 1000 * 60 * 10); // 10 minute interval
    return () => clearInterval(timeId);
  }, []);

  const { loading, data } = useFetch(
    doc(db, "jobs", item?.id!),
    true,
    "jobs",
    item?.id!
  );

  const InputPasswordPaper = () => {
    const [visible, setVisible] = React.useState(false);
    const [password, setPassword] = React.useState("123456");
    const [passwordVisible, setPasswordVisible] = useState(true);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const passwordCheck = () => {
      if (password === item.password) {
        setPasswordValid(true);
        hideDialog();
      } else {
        alert("Your password is wrong!");
      }
    }; // }
    return (
      <PaperProvider>
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Input Password</Dialog.Title>
              <Dialog.Content>
                <Text>Enter Password</Text>
                <View>
                  <TextInput
                    className="flex"
                    placeholder="e.g. 123456"
                    onChangeText={(inputText) => setPassword(inputText)}
                    caretHidden={passwordVisible}
                  />
                  <TextInput.Icon
                    onPress={() => {
                      setPasswordVisible(!passwordVisible);
                    }}
                    icon={`${passwordVisible ? "eye-off" : "eye"}`}
                  />
                </View>
                <Pressable className="" onPress={() => passwordCheck()}>
                  <Text>Verify</Text>
                </Pressable>
              </Dialog.Content>
            </Dialog>
          </Portal>
        </View>
      </PaperProvider>
    );
  };

  if (loading) return <ActivityIndicator />;

  console.log("data: ", data);

  const checkIfLate = (workdate: Date) => {
    return workdate <= new Date();
  };

  const updateJob = async (docRef: DocumentReference, updatedFields: any) => {
    try {
      //! update job
      await updateDoc(docRef, updatedFields);
      const jobCollection = await AsyncStorage.getItem("jobs");
      let collectionObj = JSON.parse(jobCollection!);
      collectionObj[item?.id!] = {
        ...collectionObj[item?.id!],
        ...updatedFields,
      };
      await AsyncStorage.setItem("jobs", JSON.stringify(collectionObj));
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const buttonPressed = () => {
    const docRef = doc(db, "jobs", item?.id!);
    if (
      new Timestamp(
        data?.expected_starting_datetime.seconds,
        data?.expected_starting_datetime.nanoseconds
      ).toDate() > new Date()
    ) {
      alert("Not the time yet");
    } else if (!checkIn) {
      //彈出視窗輸入密碼
      InputPasswordPaper();
      if (passwordValid) {
        setCheckIn(!checkIn);
        updateJob(docRef, {
          is_present: true,
          is_late: isLate,
        });
      }
    } else if (checkIn && !checkOut) {
      setCheckOut(!checkOut);
      updateJob(docRef, {
        has_complete_job: true,
        has_worked_overtime: isOvertime,
      });
    } else if (checkOut) {
      alert("You have already checked out");
    }
    // if (data?.expected_starting_datetime.toDate() > new Date()) {
    //   setCheckIn(!checkIn);
    //   updateJob(docRef, {
    //     is_present: true,
    //     is_late: isLate,
    //   });
    // } else if (checkIn) {
    //   setCheckOut(!checkOut);
    //   updateJob(docRef, {
    //     has_complete_job: true,
    //     has_worked_overtime: isOvertime,
    //   });
    // } else {
    //   alert("Not the time yet");
    // }
  };

  const itemPressed = () => {
    Alert.alert(data?.job_name);
  };

  const getFormattedHour = (date: Date) => {
    const hour = date?.getHours();
    const minutes = date?.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    if (minutes < 10) {
      return formattedHour + ":0" + minutes + ampm;
    }
    return formattedHour + ":" + minutes + ampm;
  };

  return (
    <Pressable
      onPress={itemPressed}
      className="p-5 bg-white border-b-2 border-b-slate-400 flex flex-row"
    >
      <View>
        <Text className="text-black font-bold text-sm text-left">
          {data?.job_name}
        </Text>
        <Text
          className={`${
            !checkIfLate(
              new Timestamp(
                data?.expected_starting_datetime.seconds,
                data?.expected_starting_datetime.nanoseconds
              ).toDate()
            )
              ? "text-black"
              : "text-red-500"
          } font-bold text-sm text-left`}
        >
          {`${
            !checkIfLate(
              new Timestamp(
                data?.expected_starting_datetime.seconds,
                data?.expected_starting_datetime.nanoseconds
              ).toDate()
            )
              ? "not late"
              : "late"
          }`}
        </Text>
        <Text className="text-xs text-black text-left">
          {getFormattedHour(
            new Timestamp(
              data?.expected_starting_datetime.seconds,
              data?.expected_starting_datetime.nanoseconds
            ).toDate()
          )}{" "}
          ~{" "}
          {getFormattedHour(
            new Timestamp(
              data?.expected_ending_datetime.seconds,
              data?.expected_ending_datetime.nanoseconds
            ).toDate()
          )}
        </Text>
      </View>

      <View className="flex-1 justify-end">
        <Pressable onPress={() => buttonPressed()}>
          <Text
            className={`${
              new Date() >
                new Timestamp(
                  data?.expected_starting_datetime.seconds,
                  data?.expected_starting_datetime.nanoseconds
                ).toDate() &&
              new Date() <=
                new Timestamp(
                  data?.expected_ending_datetime.seconds,
                  data?.expected_ending_datetime.nanoseconds
                ).toDate()
                ? "text-slate-400"
                : "text-black"
            } text-right`}
          >
            {checkOut ? "已完成" : checkIn ? "FINISH JOB" : "簽到"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default React.memo(AgendaItem);
