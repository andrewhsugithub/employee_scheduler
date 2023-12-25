//! JOB CARD

import useFetch from "@/hooks/useFetch";
import { db } from "@/lib/firebase";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import InputPasswordPaper from "../Dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ItemProps {
  item: {
    id?: string;
    password?: string;
    tripId?: string;
    days: any;
  };
}

const AgendaItem = ({ item }: ItemProps) => {
  const [passwordValid, setPasswordValid] = useState(false);
  const [isPresentToWork, setIsPresentToWork] = useState(false);
  const [hasCompletedJob, setHasCompletedJob] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  if (Object.keys(item).length === 2) {
    return (
      <View className="pl-4 h-12 justify-center border-b-2 border-b-slate-400">
        <Text className="text-slate-400 text-sm">
          No Events Planned Today/Add Event
        </Text>
      </View>
    );
  }

  const { loading, data } = useFetch(
    doc(db, "jobs", item?.id!),
    true,
    "jobs",
    item?.id!
  );

  useEffect(() => {
    if (loading) return;
    setIsPresentToWork(data?.is_present);
    setIsOvertime(data?.has_worked_overtime);
    setIsLate(data?.is_late);
    setHasCompletedJob(data?.has_complete_job);
  }, [loading, data]);

  if (loading) return <ActivityIndicator />;

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

  const handlePresent = async () => {
    const startWorkingTime = new Timestamp(
      data?.expected_starting_datetime.seconds,
      data?.expected_starting_datetime.nanoseconds
    ).toDate();
    const currentDate10MinAgo = new Date(new Date().getTime() - 10 * 60 * 1000);
    await updateJob({
      is_present: true,
      is_late: startWorkingTime <= currentDate10MinAgo,
      real_starting_datetime: new Date(),
    });
  };

  const updateJob = async (updatedFields: any) => {
    const docRef = doc(db, "jobs", item?.id!);
    await updateDoc(docRef, updatedFields);

    // local update
    const jobDoc = await AsyncStorage.getItem("jobs_" + item?.id!);
    const job = JSON.parse(jobDoc!);
    const newJob = { ...job, ...updatedFields };
    await AsyncStorage.setItem("jobs_" + item?.id!, JSON.stringify(newJob));
  };

  const getYearMonthDayString = (date: Date) => {
    const year = date.getFullYear() + "";
    const month = date.getMonth() + 1 + "";
    const day = date.getDate() + "";
    return year + "/" + month + "/" + day;
  };

  const handleComplete = async () => {
    const endWorkingTime = new Timestamp(
      data?.expected_ending_datetime.seconds,
      data?.expected_ending_datetime.nanoseconds
    ).toDate();
    const startWorkingTime = new Timestamp(
      data?.expected_starting_datetime.seconds,
      data?.expected_starting_datetime.nanoseconds
    ).toDate();
    const orgDiffHours = Math.round(
      (endWorkingTime.getTime() - startWorkingTime.getTime()) / 36e5
    );
    let diffHours = Math.round(
      (new Date().getTime() - startWorkingTime.getTime()) / 36e5
    );
    await updateJob({
      has_complete_job: true,
      has_worked_overtime: diffHours > orgDiffHours,
      real_ending_datetime: new Date(),
    });

    const dates: Record<string, number> = item?.days || {};
    let startingDate = startWorkingTime;
    let startHour = startWorkingTime.getHours();
    while (diffHours + startHour >= 24) {
      const startDateString = getYearMonthDayString(startingDate);
      dates[startDateString] = (dates[startDateString] || 0) + 24 - startHour;
      diffHours -= 24 - startHour;
      startHour = 0;
      startingDate.setDate(startingDate.getDate() + 1);
    }
    const startDateString = getYearMonthDayString(startingDate);
    dates[startDateString] = (dates[startDateString] || 0) + diffHours;

    const docRef = doc(db, "trips", item?.tripId!);
    const newDates = { ...item?.days!, ...dates };
    await updateDoc(docRef, { days: newDates });

    // local update
    const tripDoc = await AsyncStorage.getItem("trips_" + item?.tripId!);
    const trip = JSON.parse(tripDoc!);
    const newTrip = { ...trip, days: newDates };
    await AsyncStorage.setItem(
      "trips_" + item?.tripId!,
      JSON.stringify(newTrip)
    );
    //! todo add notification
  };

  return (
    <View>
      <Pressable className="p-5 bg-white border-b-2 border-b-slate-400 flex flex-row">
        <View>
          <Text className="text-black font-bold text-sm text-left">
            {data?.job_name}
          </Text>
          {isPresentToWork && (
            <Text
              className={`${
                isLate ? "text-red-500" : "text-black"
              } font-bold text-sm text-left`}
            >
              {`${isLate ? "late" : "not late"}`}
            </Text>
          )}
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
          {!isPresentToWork && (
            <Pressable
              onPress={() => {
                if (
                  new Date() <
                  new Timestamp(
                    data?.expected_starting_datetime.seconds,
                    data?.expected_starting_datetime.nanoseconds
                  ).toDate()
                ) {
                  alert("Not the time yet");
                  return;
                }
                setShowDialog(true);
              }}
            >
              <Text>簽到</Text>
            </Pressable>
          )}
          {isPresentToWork && !hasCompletedJob && (
            <Pressable onPress={() => setShowDialog(true)}>
              <Text>我完成了</Text>
            </Pressable>
          )}
          {hasCompletedJob && (
            <Pressable>
              <Text>已完成</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
      <View>
        <InputPasswordPaper
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          correctPassword={item.password!}
          setPasswordValid={setPasswordValid}
          handleAfterConfirm={
            !isPresentToWork
              ? async () => await handlePresent()
              : async () => await handleComplete()
          }
        />
      </View>
    </View>
  );
};

export default React.memo(AgendaItem);
