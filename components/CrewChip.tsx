import { Chip } from "react-native-paper";
import { Text, View } from "react-native";
import { useState } from "react";

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
    if (isCaptain) return;
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
        icon="account"
        onPress={handleSelect}
        mode="flat"
        className={`${
          selected
            ? isCaptain
              ? "bg-yellow-400"
              : "bg-purple-400"
            : "bg-slate-400"
        }`}
      >
        <Text>{user.name}</Text>
      </Chip>
    </View>
  );
};

export default CrewChip;
