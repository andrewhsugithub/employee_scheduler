import { useState } from "react";
import { Text, SafeAreaView, View, Pressable } from "react-native";
import QRCodeGenerator from "./QRCodeGenerator";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

const TripInfo = () => {
  const [generate, setGenerate] = useState(false);

  return (
    <View>
      <Text>Your schedule in next trip: </Text>
      <Text className="text-red-600">
        If you are captain: Press Start Button this will be the qr code and
        verification code of the trip you receive in your email 1. make the ipad
        scan your qr code or type in the code first 2. when your crew arrives at
        the scene they can scan or enter the code on the ipad so that it means
        that they are here
      </Text>
      <StyledPressable
        className={`${!generate ? "bg-green-600" : "bg-red-500"} p-3`}
        onPress={() => setGenerate((generate) => !generate)}
      >
        <Text className="font-bold text-white">
          {!generate ? "Start Trip/Generate QR Code" : "Close QR Code"}
        </Text>
      </StyledPressable>
      {generate && <QRCodeGenerator id={Math.random() * 10000 + ""} />}
      <Text className="text-red-600">
        No matter if you are crew or captain you all need to scan or type the
        code on the ipad
      </Text>
      <Pressable className="bg-green-600 p-3">
        <Text className="font-bold text-white">Scan QR Code</Text>
      </Pressable>
      <Text>Type Verification Code</Text>
      <Pressable className="bg-green-600 p-3">
        <Text className="font-bold text-white">Verify</Text>
      </Pressable>
    </View>
  );
};

export default TripInfo;
