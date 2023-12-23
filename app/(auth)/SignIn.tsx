import { Link, useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { auth } from "@/lib/firebase";
import { TextInput } from "react-native-paper";
import {
  type SignInFormSchema,
  SignInSchema,
} from "@/lib/validations/signInSchema";
import { Controller, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { Zocial, Octicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "@/components/Input";
import { useCheckConnectionContext } from "@/context/checkConnectionContext";

// const phoneUtil = PhoneNumberUtil.getInstance();

const SignIn = () => {
  const router = useRouter();

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const { isConnected } = useCheckConnectionContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    if (!localAuth.success) return;
    const localUser = await AsyncStorage.getItem("currentUser");
    const user = JSON.parse(localUser!);
    if (user) router.push(`/(drawer)/${user.displayName}/MyTrips`);
    console.log("user: ", user);
  }

  useEffect(() => {
    const getUser = async () => {
      await onAuthenticate();
    };
    getUser();
    // TODO : check if user is authenticated via firebase directly make it work offline with async storage
  }, []);

  // TODO: sign in process here
  const handleSignIn = async (data: SignInFormSchema) => {
    const authPass = await AsyncStorage.getItem("password");
    // const displayName = await AsyncStorage.getItem("username");
    const localUser = await AsyncStorage.getItem("currentUser");
    const currentUser = JSON.parse(localUser!);
    const displayName = currentUser?.displayName;
    const authEmail = currentUser?.email;

    if (
      !isConnected &&
      authEmail === data.email.trim() &&
      authPass === data.password
    ) {
      router.push(`/(drawer)/${displayName}/MyTrips`);
      return;
    }

    await signInWithEmailAndPassword(auth, data.email.trim(), data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) alert("Please verify your email first");
        else {
          await AsyncStorage.setItem("email", data.email.trim());
          await AsyncStorage.setItem("password", data.password);
          await AsyncStorage.setItem("username", user!.displayName!);
          router.push(`/(drawer)/${user.displayName}/MyTrips`);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(SignInSchema),
  });
  const [text, setText] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <SafeAreaView className="h-screen">
      <View className="h-full p-40 flex flex-col justify-around">
        <KeyboardAvoidingView
          behavior="padding"
          className="h-4/5 justify-around mb-10"
        >
          <Text className="text-3xl text-black dark:text-white font-bold text-center">
            Sign In Form
          </Text>
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
        </KeyboardAvoidingView>
        <View>
          <Pressable
            className="bg-green-500 p-4 rounded-full items-center mb-3"
            onPress={handleSubmit(handleSignIn)}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" className="text-gray-400" />
            ) : (
              <Text className="text-2xl font-semibold">Sign In</Text>
            )}
          </Pressable>
          <Text className="text-right dark:text-white">
            Don't have an account?{" "}
            <Link href={`/(auth)/SignUp`} className="underline dark:text-white">
              <Text>Sign Up?</Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
