import { useState } from "react";
import { Pressable, View, Text, Modal, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";

interface PickDateProps {
  onChange: (...event: any[]) => void;
  value: Date;
  label: string;
}

const PickDate = ({ onChange, value, label }: PickDateProps) => {
  const [show, setShow] = useState(false);
  const onChangeDate = (date: Date | undefined) => {
    onChange(date!);
    setShow(false);
  };

  return (
    <View>
      {/* <Text className="text-blue-400"> */}
      {/* <FontAwesome name="calendar" size={24} color="black" /> */}
      {/* <Text className="text-black">
        {"\t"}
        {value.toLocaleString()}
      </Text> */}
      {/* </Text> */}
      <TextInput
        label={label}
        value={value.toLocaleString()}
        mode="outlined"
        className="flex-1"
        onPressIn={() => setShow(() => !show)}
        left={<TextInput.Icon icon="calendar" />}
        editable={false}
      />

      <DateTimePickerModal
        isVisible={show}
        mode="datetime"
        onConfirm={onChangeDate}
        onCancel={() => setShow(false)}
      />
    </View>
  );
};

export default PickDate;
