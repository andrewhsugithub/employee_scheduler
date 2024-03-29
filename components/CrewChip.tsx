﻿import { Chip } from "react-native-paper";
import { Text, View } from "react-native";
import { useState } from "react";
import { set } from "zod";

interface CrewChipProps {
  user: {
    name: string;
    id: string;
  };
  remove: any;
  prepend: any;
  fields: any;
  isCaptain: boolean;
}

const CrewChip = ({
  user,
  remove,
  prepend,
  fields,
  isCaptain,
}: CrewChipProps) => {
  const [selected, setSelected] = useState(
    fields.findIndex((item: any) => item.crew_id === user.id) >= 0
      ? true
      : false
  );
  const handleSelect = () => {
    if (isCaptain) {
      if (selected === false) setSelected(true);
      return;
    }
    if (selected) {
      remove(fields.findIndex((item: any) => item.crew_id === user.id));
    } else
      prepend({
        crew_id: user.id,
        crew_job: [],
      });
    setSelected((selected) => !selected);
  };

  return (
    <View className="p-1">
      <Chip
        avatar={
          <View className=" bg-purple-500 rounded-full flex items-center justify-center">
            <Text className="text-center text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </Text>
          </View>
        }
        onPress={handleSelect}
        mode="flat"
        className={`${
          selected
            ? isCaptain
              ? "bg-yellow-400"
              : "bg-purple-400"
            : isCaptain
            ? "bg-yellow-400"
            : "bg-slate-400"
        }`}
      >
        <Text>{user.name}</Text>
      </Chip>
    </View>
  );
};

export default CrewChip;
