//! JOB CARD

import React, { useCallback, useEffect, useState } from "react";
import { Alert, View, Text, Button, Pressable } from "react-native";

interface Item {
  title: string;
  hour: Date;
  duration: string;
  endTime: Date;
  startDate: Date;
}

interface ItemProps {
  item: Item;
}

const MINUTE_MS = 1000 * 60 * 30;

const AgendaItem = (props: ItemProps) => {
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const { item } = props;
  //TODO: pass in job starting date and ending date
  const endDate = item.endTime;
  const hour = item.hour;
  //new Date("2024-10-10T00:00:00");

  const latecheck = () => {
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth();
    const nowDate = new Date().getDate();
    const nowhour = new Date().getHours();
    const nowmins = new Date().getMinutes();
    const startYear = hour.getFullYear();
    const startMonth = hour.getMonth();
    const startDate = hour.getDate();
    const starthour = hour.getHours();
    const startmins = hour.getMinutes();
    if (nowYear < startYear) {
      return true;
    } else if (nowYear > startYear) {
      return false;
    }
    if (nowMonth < startMonth) {
      return true;
    } else if (nowMonth > startMonth) {
      return false;
    }
    if (nowDate > startDate) {
      return false;
    } else if (nowDate < startDate) {
      return true;
    }
    if (nowhour >= starthour) {
      const dhour = (nowhour - starthour) * 60;
      const dmins = dhour + nowmins - startmins;
      if (dmins > 9) return false;
      else if (dmins <= 9) return true;
    } else if (nowhour < starthour) {
      return true;
    }
  };

  useEffect(() => {
    if (!checkIn) {
      const nowYear = new Date().getFullYear();
      const nowMonth = new Date().getMonth();
      const nowDate = new Date().getDate();
      const nowHour = new Date().getHours();
      const nowMins = new Date().getMinutes();
      const startYear = hour?.getFullYear();
      const startMonth = hour?.getMonth();
      const startDate = hour?.getDate();
      const startHour = hour?.getHours();
      const startMins = hour?.getMinutes();
      if (nowYear < startYear) {
        return;
      }
      if (nowMonth < startMonth) {
        return;
      }
      if (nowDate < startDate) {
        return;
      }
      if (nowHour < startHour) {
        return;
      }
      if (nowMins < startMins) {
        return;
      }
      const timeId = setInterval(() => latecheck(), 1000 * 60);
      return () => clearInterval(timeId);
    }
  }, []);

  const buttonPressed = useCallback(() => {
    if (!checkIn) {
      setCheckIn(!checkIn);
    } else if (checkIn) {
      setCheckOut(!checkOut);
    }
    //if (new Date() <= hour) {
    //  Alert.alert("cannot take attendance!");
    //} else {
    //  Alert.alert("Passcode: ");
    //}
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

  if (Object.keys(item).length === 0) {
    return (
      <View className="pl-4 h-12 justify-center border-b-2 border-b-slate-400">
        <Text className="text-slate-400 text-sm">No Events Planned Today</Text>
      </View>
    );
  }

  const getFormattedHour = (date: Date) => {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    if (minutes < 10) {
      return formattedHour + ":0" + minutes + ampm;
    }
    return formattedHour + ":" + minutes + ampm;
  };

  //! overtime
  useEffect(() => {
    const interval = setInterval(() => {
      if (new Date() <= endDate) return;
      console.log(`Logs every ${MINUTE_MS / 60 / 1000} minutes`);
      // TODO: firebase notification
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <Pressable
      onPress={itemPressed}
      className="p-5 bg-white border-b-2 border-b-slate-400 flex flex-row"
    >
      <View>
        <Text className="text-black font-bold text-sm text-left">
          {" "}
          {item.title}
        </Text>
        <Text className="text-black font-bold text-sm text-left">
          {" "}
          {`${latecheck() ? "not late" : "late"}`}
        </Text>
        <Text className="text-xs text-black text-left">
          {" "}
          {getFormattedHour(item.hour)} ~ {getFormattedHour(item.endTime)}
        </Text>
      </View>

      <View className="flex-1 justify-end">
        <Button
          color={"grey"}
          title={`${checkOut ? "已完成" : checkIn ? "FINISH" : "簽到"}`}
          onPress={buttonPressed}
        />
      </View>
    </Pressable>
  );
};

export default React.memo(AgendaItem);
