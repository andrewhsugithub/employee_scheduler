import React from "react";
import { View, Text } from "react-native";

interface IntervalProps {
  name: string;
  start: number;
  end: number;
}

const timeIntervals = [1, 2, 3, 4, 5, 6, 7, 8];

const Interval = ({ name, start, end }: IntervalProps) => {
  const roundTo2DecimalPlaces = (num: number) => {
    return Math.round(num * 100) / 100;
  };

  let coloredPortion = roundTo2DecimalPlaces(
    ((Math.min(480, end) - Math.max(0, start)) / 480) * 100
  );
  let whiteLeft = roundTo2DecimalPlaces((Math.max(0, start) / 480) * 100);
  let whiteRight = roundTo2DecimalPlaces(
    ((480 - Math.min(480, end)) / 480) * 100
  );

  return (
    <View className="flex flex-row px-8 items-center h-fit py-4">
      <Text className="text-center font-bold text-2xl w-1/5">{name}</Text>
      <View className="flex flex-[8] flex-row justify-between items-center w-4/5 h-full relative">
        <View className="absolute flex flex-row h-full w-full bg-blue">
          <View
            className="h-full bg-white"
            style={{ minWidth: `${whiteLeft}%` }}
          ></View>
          <View
            className="h-full bg-red-500 border-4 border-black border-x-8 border-l-cyan-600 border-r-cyan-600"
            style={{ minWidth: `${coloredPortion}%` }}
          >
            <View className=" flex flex-row justify-between items-center">
              <Text className="mt-[-40] ml-[-10]">
                {Math.floor(start / 60)}: {start % 60}
              </Text>
              <Text className="font-bold text-3xl">Job Name</Text>
              <Text className="mt-[-40] mr-[-10]">
                {Math.floor(end / 60)}: {end % 60} minutes
              </Text>
            </View>
          </View>
          <View
            className="h-full bg-white"
            style={{ minWidth: `${whiteRight}%` }}
          ></View>
        </View>
        {timeIntervals.map((time) => (
          <View
            key={time}
            className="border border-black flex-1 h-full flex flex-row"
          ></View>
        ))}
      </View>
    </View>
  );
};

export default Interval;
