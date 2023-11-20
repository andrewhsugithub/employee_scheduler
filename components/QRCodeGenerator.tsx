import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";

interface QRCodeGeneratorProps {
  id: string;
}

const QRCodeGenerator = ({ id }: QRCodeGeneratorProps) => {
  const redirectUrl = Linking.createURL(`${id}/rollcall`);

  return (
    <View className="p-10">
      <QRCode value={`${redirectUrl}`} />
    </View>
  );
};

export default QRCodeGenerator;
