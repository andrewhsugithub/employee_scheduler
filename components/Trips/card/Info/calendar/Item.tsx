//! JOB CARD

import useFetch from "@/hooks/useFetch";
import { db } from "@/lib/firebase";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import InputPasswordPaper from "../Dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAborted } from "zod";

interface ItemProps {
  item: {
    id?: string;
    password?: string;
    tripId?: string;
    isDateExpired: boolean;
    crewId: string;
    isAboard: boolean;
  };
}

const AgendaItem = ({ item }: ItemProps) => {
  const [passwordValid, setPasswordValid] = useState(false);
  const [isPresentToWork, setIsPresentToWork] = useState(false);
  const [hasCompletedJob, setHasCompletedJob] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [days, setDays] = useState<Record<string, number>>({});

  if (!("id" in item)) {
    return (
      <View className="pl-4 h-12 justify-center border-b-2 border-b-slate-400">
        <Text className="text-slate-400 text-sm">
          No Events Planned Today/Add Event
        </Text>
      </View>
    );
  }

  console.log("isAboard in item:", item.isAboard);

  const { loading, data } = useFetch(
    doc(db, "jobs", item?.id!),
    true,
    "jobs",
    item?.id!
  );

  const { loading: userLoading, data: userData } = useFetch(
    doc(db, "users", item?.crewId!),
    true,
    "users",
    item?.crewId!
  );
  useEffect(() => {
    if (userLoading) return;
    setDays(userData?.days || {});
    console.log("changed days", userData?.days);
  }, [userLoading, userData]);

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
      data?.expected_starting_datetime?.seconds,
      data?.expected_starting_datetime?.nanoseconds
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
      data?.expected_ending_datetime?.seconds,
      data?.expected_ending_datetime?.nanoseconds
    ).toDate();
    const startWorkingTime = new Timestamp(
      data?.expected_starting_datetime?.seconds,
      data?.expected_starting_datetime?.nanoseconds
    ).toDate();
    const realStartWorkingTime = new Timestamp(
      data?.real_starting_datetime?.seconds,
      data?.real_starting_datetime?.nanoseconds
    ).toDate();
    const orgDiffHours = Math.floor(
      (endWorkingTime.getTime() - startWorkingTime.getTime()) / 36e5
    );
    let diffHours = Math.floor(
      (new Date().getTime() - realStartWorkingTime.getTime()) / 36e5
    );
    await updateJob({
      has_complete_job: true,
      has_worked_overtime: diffHours > orgDiffHours,
      real_ending_datetime: new Date(),
    });

    //! days
    let startingDate = realStartWorkingTime;
    let startHour = realStartWorkingTime.getHours();
    while (diffHours + startHour >= 24) {
      const startDateString = getYearMonthDayString(startingDate);
      days[startDateString] = (days[startDateString] || 0) + 24 - startHour;
      diffHours -= 24 - startHour;
      startHour = 0;
      startingDate.setDate(startingDate.getDate() + 1);
    }
    const startDateString = getYearMonthDayString(startingDate);
    days[startDateString] = (days[startDateString] || 0) + diffHours;

    const docRef = doc(db, "users", item?.crewId!);
    await updateDoc(docRef, { days: days });

    // local update
    const userDoc = await AsyncStorage.getItem("users_" + item?.crewId!);
    const trip = JSON.parse(userDoc!);
    const newDates = { ...trip, days: days };
    await AsyncStorage.setItem(
      "users_" + item?.tripId!,
      JSON.stringify(newDates)
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
          {!item.isDateExpired ? (
            <Text className="text-xs text-black text-left">
              {getFormattedHour(
                new Timestamp(
                  data?.expected_starting_datetime?.seconds,
                  data?.expected_starting_datetime?.nanoseconds
                ).toDate()
              )}{" "}
              ~{" "}
              {getFormattedHour(
                new Timestamp(
                  data?.expected_ending_datetime?.seconds,
                  data?.expected_ending_datetime?.nanoseconds
                ).toDate()
              )}
            </Text>
          ) : (
            <Text className="text-xs text-black text-left">
              {data?.real_starting_datetime?.seconds ? (
                <>
                  {getFormattedHour(
                    new Timestamp(
                      data?.real_starting_datetime?.seconds,
                      data?.real_starting_datetime?.nanoseconds
                    ).toDate()
                  )}{" "}
                  ~{" "}
                  {getFormattedHour(
                    new Timestamp(
                      data?.real_ending_datetime?.seconds,
                      data?.real_ending_datetime?.nanoseconds
                    ).toDate()
                  )}
                </>
              ) : (
                <Text className="text-red-700 font-extrabold ">
                  You are not present
                </Text>
              )}
            </Text>
          )}
        </View>

        {!item.isDateExpired && (
          <View className="flex-1 justify-end">
            {!isPresentToWork && (
              <Pressable
                onPress={() => {
                  if (
                    new Date() <
                    new Timestamp(
                      data?.expected_starting_datetime?.seconds,
                      data?.expected_starting_datetime?.nanoseconds
                    ).toDate()
                  ) {
                    alert("Not the time yet");
                    return;
                  } else if (!item.isAboard) {
                    alert("You are not aboard");
                    return;
                  }
                  setShowDialog(true);
                }}
              >
                <Text className=" text-right"> 簽到</Text>
              </Pressable>
            )}
            {isPresentToWork && !hasCompletedJob && (
              <Pressable onPress={() => setShowDialog(true)}>
                <Text className="text-blue-500 text-right"> 我完成了</Text>
              </Pressable>
            )}
            {hasCompletedJob && (
              <Pressable>
                <Text className="text-green-500 text-right"> 已完成</Text>
              </Pressable>
            )}
          </View>
        )}
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
