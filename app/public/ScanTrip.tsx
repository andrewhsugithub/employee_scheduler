import QRCodeGenerator from "../../components/QRCodeGenerator";
import { SafeAreaView, Text, Pressable } from "react-native";

const ScanTrip = () => {
  return (
    <SafeAreaView>
      <Pressable>
        <Text>Scan:??? Is this redundant</Text>
        <QRCodeGenerator id={Math.random() * 10000 + ""} />
      </Pressable>
    </SafeAreaView>
  );
};

export default ScanTrip;
