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

// const phoneUtil = PhoneNumberUtil.getInstance();

const SignIn = () => {
  const router = useRouter();

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
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
    const email = await AsyncStorage.getItem("email");
    const pass = await AsyncStorage.getItem("password");
    await signInWithEmailAndPassword(auth, email!, pass!)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) alert("Please verify your email first");
        else {
          // await AsyncStorage.setItem("username", user!.displayName!);
          router.push(`/(drawer)/${user.displayName}/MyTrips`);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  useEffect(() => {
    onAuthenticate();
    const user = getAuth().currentUser;
    if (user) router.push(`/(drawer)/${user.displayName}/MyTrips`);
    console.log("user: ", user);
    // TODO : check if user is authenticated via firebase directly make it work offline with async storage
  }, []);

  // TODO: sign in process here
  const handleSignIn = async (data: SignInFormSchema) => {
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
  const [passwordVisible, setPasswordVisible] = useState(true);
  return (
    <SafeAreaView className="h-screen">
      <KeyboardAvoidingView>
        <View className="h-full p-40 flex flex-col justify-around">
          <Text className="text-2xl text-black dark:text-white font-extrabold text-center">
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
          />
          <View>
            <Pressable
              className="bg-green-500 p-4 rounded-full items-center mb-3"
              onPress={handleSubmit(handleSignIn)}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" className="text-gray-400" />
              ) : (
                <Text>Sign In</Text>
              )}
            </Pressable>
            <Text className="text-right dark:text-white">
              Don't have an account?{" "}
              <Link
                href={`/(auth)/SignUp`}
                className="underline dark:text-white"
              >
                <Text>Sign Up?</Text>
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
