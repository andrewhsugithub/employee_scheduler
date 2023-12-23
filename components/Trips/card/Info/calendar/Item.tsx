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
import React, { useEffect, useState } from "react";
import { Alert, View, Text, Pressable, ActivityIndicator } from "react-native";
import InputPasswordPaper from "../Dialog";

interface ItemProps {
  item: {
    id?: string;
    password?: string;
  };
}

const AgendaItem = ({ item }: ItemProps) => {
  const [passwordValid, setPasswordValid] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  if (Object.keys(item).length === 1) {
    return (
      <View className="pl-4 h-12 justify-center border-b-2 border-b-slate-400">
        <Text className="text-slate-400 text-sm">
          No Events Planned Today/Add Event
        </Text>
      </View>
    );
  }
  //TODO if past end time should not be able to check in
  //TODO change format (eg.color, text) between different job status
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

  if (loading) return <ActivityIndicator />;

  console.log("data: ", data);

  const checkIfLate = (workdate: Date) => {
    return workdate <= new Date();
  };

  const updateJob = async (docRef: DocumentReference, updatedFields: any) => {
    try {
      //! update job
      await updateDoc(docRef, updatedFields);
      const jobCollection = await AsyncStorage.getItem("jobs_" + item.id!);
      let collectionObj = JSON.parse(jobCollection!);
      collectionObj = {
        ...collectionObj,
        ...updatedFields,
      };
      await AsyncStorage.setItem(
        "jobs_" + item.id!,
        JSON.stringify(collectionObj)
      );
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleCorrectPassword = (
    docRef: DocumentReference,
    setFunc: () => void,
    updatedFields: any
  ) => {
    setFunc();
    updateJob(docRef, updatedFields);
    alert("Your password is correct!");
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
      setShowDialog(true);
      const setFunc = () => setCheckIn(!checkIn);
      if (passwordValid)
        handleCorrectPassword(docRef, setFunc, {
          is_present: true,
          is_late: isLate,
        });
    } else if (checkIn && !checkOut) {
      setShowDialog(true);
      const setFunc = () => setCheckOut(!checkOut);
      if (passwordValid)
        handleCorrectPassword(docRef, setFunc, {
          has_complete_job: true,
          has_worked_overtime: isOvertime,
        });
    } else if (checkOut) {
      alert("You have already checked out");
    }
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
    <View>
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
      <View>
        <InputPasswordPaper
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          correctPassword={item.password!}
          setPasswordValid={setPasswordValid}
        />
      </View>
    </View>
  );
};

export default React.memo(AgendaItem);
