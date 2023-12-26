import { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import Dialog from "react-native-dialog";

interface DialogProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setPasswordValid: React.Dispatch<React.SetStateAction<boolean>>;
  correctPassword: string;
  handleAfterConfirm: () => Promise<void>;
}

const InputPasswordPaper = ({
  showDialog,
  setShowDialog,
  correctPassword,
  setPasswordValid,
  handleAfterConfirm,
}: DialogProps) => {
  const [visible, setVisible] = useState(true);
  const [typedPassword, setTypedPassword] = useState("");

  if (!showDialog) return;

  const confirmPassword = async () => {
    console.log("confirm password");
    setPasswordValid(correctPassword === typedPassword);
    if (correctPassword === typedPassword) {
      setTypedPassword("");
      Alert.alert("Password Status", "Your password is correct", [
        { text: "OK", onPress: () => setShowDialog(false) },
      ]);
      await handleAfterConfirm();
    } else alert("Wrong Password!");
  };

  return (
    <View>
      <Dialog.Container visible={showDialog}>
        <Dialog.Title className="text-lg justify-items-start items-start">
          Enter Password
        </Dialog.Title>
        <TextInput
          label={"password"}
          value={typedPassword}
          onChangeText={(password: string) => setTypedPassword(password)}
          className="m-2 rounded-md bg-transparent"
          mode="flat"
          underlineStyle={{
            display: "none",
          }}
          right={
            <TextInput.Icon
              icon={!visible ? "eye-off" : "eye"}
              onPress={() => setVisible(!visible)}
            />
          }
          secureTextEntry={visible}
        />
        <Dialog.Button label="Cancel" onPress={() => setShowDialog(false)} />
        <Dialog.Button label="Confirm" onPress={confirmPassword} />
      </Dialog.Container>
    </View>
  );
};

export default InputPasswordPaper;
