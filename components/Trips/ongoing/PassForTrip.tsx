import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Alert,
  useColorScheme,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  type SignInFormSchema,
  SignInSchema,
} from "@/lib/validations/signInSchema";
import { Controller, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import * as LocalAuthentication from "expo-local-authentication";

interface RollCallProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
  password: string;
}

const PassForTrip = ({ show, handleShow, password }: RollCallProps) => {
  const [seePass, setSeePass] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [correctPass, setCorrectPass] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const colorScheme = useColorScheme();

  // Check if hardware supports biometrics
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  async function onAuthenticate() {
    const localAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate",
      fallbackLabel: "Enter Password",
    });
    setIsAuthenticated(localAuth.success);

    if (!localAuth.success) setCorrectPass(false);
    else setCorrectPass(true);
  }

  useEffect(() => {
    if (correctPass) return;
    onAuthenticate();
  }, [correctPass]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(SignInSchema),
  });

  const handleSignIn = async (data: SignInFormSchema) => {
    const localUser = await AsyncStorage.getItem("currentUser");
    const currentUser = JSON.parse(localUser!);
    const authEmail = currentUser?.email;
    const authPass = await AsyncStorage.getItem("password");
    if (data.email === authEmail && data.password === authPass) {
      setCorrectPass(true);
    } else {
      setCorrectPass(false);
      Alert.alert("Incorrect email or password");
    }
  };

  return (
    <Modal animationType="slide" visible={show} presentationStyle="pageSheet">
      <View className={`p-10 bg-white dark:bg-slate-800 h-full`}>
        <Text className="text-center font-bold text-2xl dark:text-white pt-2">
          Enter email and password to see your
        </Text>
        <Text className="text-center font-bold text-3xl text-red-600 uppercase ">
          Pass
        </Text>
        <Text className="text-center font-bold text-2xl dark:text-white pb-2">
          for this trip
        </Text>
        {!correctPass && (
          <KeyboardAvoidingView
            behavior="padding"
            className="h-4/5 justify-evenly mb-10"
          >
            <Input
              control={control}
              errors={errors}
              name="email"
              label={"📫Email"}
            />
            <Input
              control={control}
              errors={errors}
              name="password"
              label={"🔒Password"}
              isPassword={!passwordVisible}
              right={
                passwordVisible ? (
                  <TextInput.Icon
                    onPress={() => {
                      console.log("Eye-off pressed");
                      setPasswordVisible(!passwordVisible);
                    }}
                    icon="eye-off"
                  />
                ) : (
                  <TextInput.Icon
                    onPress={() => {
                      console.log("Eye-on pressed");
                      setPasswordVisible(!passwordVisible);
                    }}
                    icon="eye"
                  />
                )
              }
            />
            <Pressable
              className="bg-green-500 p-4 rounded-full items-center mb-3"
              onPress={handleSubmit(handleSignIn)}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" className="text-gray-400" />
              ) : (
                <Text className="text-2xl font-semibold">See Pass</Text>
              )}
            </Pressable>
          </KeyboardAvoidingView>
        )}
        {correctPass && (
          <View className=" p-32 flex-col gap-y-10 items-center justify-center">
            <TextInput
              label="Your Passcode for this trip"
              secureTextEntry={seePass ? false : true}
              value={password}
              editable={false}
              className="w-full rounded-2xl"
              right={
                seePass ? (
                  <TextInput.Icon
                    onPress={() => setSeePass(false)}
                    icon="eye-off"
                  />
                ) : (
                  <TextInput.Icon onPress={() => setSeePass(true)} icon="eye" />
                )
              }
            />
            <Pressable
              onPress={() => setCorrectPass(false)}
              className="bg-green-500 p-4 rounded-full items-center mb-3"
            >
              <Text className="text-2xl font-semibold">Done seeing</Text>
            </Pressable>
          </View>
        )}
        <Pressable
          onPress={() => {
            handleShow(false);
            setCorrectPass(false);
          }}
          className="absolute top-7 right-7"
        >
          <MaterialIcons
            name="close"
            color={`${colorScheme === "dark" ? "white" : "black"}`}
            size={22}
          />
        </Pressable>
      </View>
    </Modal>
  );
};

export default PassForTrip;
