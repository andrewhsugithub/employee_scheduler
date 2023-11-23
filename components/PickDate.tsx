import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, View, Text } from "react-native";

interface PickDateProps {
  onChange: (...event: any[]) => void;
  value: Date;
}

const PickDate = ({ onChange, value }: PickDateProps) => {
  const [show, setShow] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    if (type === "set") {
      onChange(date!);
      // setShow(false);
    }
  };

  return (
    <View>
      <Pressable className="bg-white " onPress={() => setShow(() => !show)}>
        <Text className="text-blue-400">
          <Text className="rounded-full">Set Date & Time:{"\t"}</Text>
          <Text className="text-black">{value.toLocaleString()}</Text>
        </Text>
      </Pressable>
      {show && (
        <>
          <DateTimePicker
            value={value}
            mode="datetime"
            display="spinner"
            onChange={onChangeDate}
          />
        </>
      )}
    </View>
  );
};

export default PickDate;
