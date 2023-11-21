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
      setShow(false);
    } else if (type === "dismissed") {
      setShow(false);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setShow(true)}>
        <Text>{value.toLocaleString()}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="calendar"
          is24Hour={true}
          onChange={onChangeDate}
        />
      )}
    </View>
  );
};

export default PickDate;
