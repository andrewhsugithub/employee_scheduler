//! JOB CARD

import React, { useCallback, useEffect, useState } from "react";
import { Alert, View, Text, Button, Pressable } from "react-native";

interface Item {
  title: string;
  hour: string;
  duration: string;
  endTime: Date;
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
  //new Date("2024-10-10T00:00:00");

  const buttonPressed = useCallback(() => {
    Alert.alert("Passcode: ");
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
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return formattedHour + ampm;
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
        <Text className="text-black font-bold text-sm">{item.title}</Text>
        <Text className="text-xs text-black">
          {item.hour} ~ {getFormattedHour(item.endTime)}
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
