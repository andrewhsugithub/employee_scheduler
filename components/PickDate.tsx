import { useState } from "react";
import { Pressable, View, Text, Modal, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";
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
      <Pressable onPress={() => setShow(true)}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            placeholder="Select Date"
            // left={<AntDesign name="calendar" size={24} color="black" />}
            value={value.toLocaleString("zh-TW", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              dayPeriod: "short",
              minute: "2-digit",
              hour12: true,
              hour: "2-digit",
            })}
            mode="flat"
            className="rounded-md"
            underlineStyle={{
              // borderRadius: 9999,
              // width: "90%",
              // justifyContent: "center",
              // alignSelf: "center",
              // alignContent: "center",
              // start: "5%",
              display: "none",
            }}
            //left={<TextInput.Icon icon="calendar" />}
            editable={false}
          />
        </View>
      </Pressable>

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
