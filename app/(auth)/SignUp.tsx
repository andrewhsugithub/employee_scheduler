import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import PhoneInput from "react-native-phone-number-input";
import { type AuthFormSchema, AuthSchema } from "@/lib/validations/authSchema";
import { TextInput } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "@/components/Input";

// const phoneUtil = PhoneNumberUtil.getInstance();

const Auth = () => {
  const router = useRouter();

  // const [value, setValue] = useState("");
  // const [formattedValue, setFormattedValue] = useState("");
  // const [valid, setValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const phoneInput = useRef<PhoneInput>(null);

  // sign in process here
  const SignUp = async (data: AuthFormSchema) => {
    setIsSubmitting(true);

    // TODO: need to format phone number ex: omit (09)
    // const phone = `+${phoneInput.current?.getCallingCode()} ${value}`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );
      await updateProfile(userCredential.user, {
        displayName: data.username,
        photoURL: data.photoUrl,
      });
      await updateEmail(userCredential.user, data.email.trim());

      const user = {
        name: data.username,
        email: data.email.trim(),
        // phone_number: phone,
        created_at: new Date().toUTCString(),
      };
      console.log("user: ", user);

      await setDoc(doc(db, "users", userCredential.user.uid), user);

      await sendEmailVerification(userCredential.user);
      alert("Sent verification email, please verify your email to sign in");

      await AsyncStorage.setItem("email", data.email.trim());
      await AsyncStorage.setItem("password", data.password);
      await AsyncStorage.setItem("username", data.username);
      await AsyncStorage.setItem("userId", userCredential.user.uid);
    } catch (err) {
      console.log(err);
      alert(err);
    }

    setIsSubmitting(false);
    router.push(`/(auth)/SignIn`);
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AuthFormSchema>({
    resolver: zodResolver(AuthSchema),
  });
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordVisibleDouble, setPasswordVisibleDouble] = useState(true);
  return (
    <SafeAreaView className="h-screen">
      <View className="h-full p-40 flex flex-col justify-around">
        <KeyboardAvoidingView behavior={"position"} className="flex-1">
          <Text className="text-3xl text-black dark:text-white font-bold text-center pb-3">
            Sign Up Form
          </Text>
          <Input
            control={control}
            errors={errors}
            name="username"
            label={"👤Name"}
          />
          <Input
            control={control}
            errors={errors}
            name="email"
            label={"📧Email"}
          />
          <Input
            control={control}
            errors={errors}
            name="password"
            label={"🔒Password"}
            isPassword={!passwordVisible}
            right={
              !passwordVisible ? (
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

          <Input
            control={control}
            errors={errors}
            name="confirmPassword"
            label={"🔒Confirm Password"}
            isPassword={!passwordVisibleDouble}
            right={
              !passwordVisibleDouble ? (
                <TextInput.Icon
                  onPress={() => {
                    console.log("Eye-off pressed");
                    setPasswordVisibleDouble(!passwordVisibleDouble);
                  }}
                  icon="eye-off"
                />
              ) : (
                <TextInput.Icon
                  onPress={() => {
                    console.log("Eye-on pressed");
                    setPasswordVisibleDouble(!passwordVisibleDouble);
                  }}
                  icon="eye"
                />
              )
            }
          />
        </KeyboardAvoidingView>
        {/* <View className="">
          <PhoneInput
            ref={phoneInput}
            countryPickerButtonStyle={{ width: "20%" }}
            containerStyle={{ width: "100%" }}
            defaultValue={value}
            defaultCode="TW"
            layout="first"
            onChangeText={(text) => setValue(text)}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
              submitted && setValid(phoneInput.current?.isValidNumber(text)!);
            }}
            // withDarkTheme
            withShadow
          />
          {!valid && <Text>Phone number is not valid</Text>}
        </View> */}
        <View>
          <Pressable
            className="bg-green-500 p-4 rounded-full items-center mt-6 mb-6"
            onPress={handleSubmit(
              (data) => {
                // const checkValid =
                //   phoneInput.current?.isValidNumber(formattedValue);
                // setValid(checkValid!);
                setSubmitted(true);
                // if (!checkValid) return;
                SignUp(data);
              },
              (data) => {
                // const checkValid =
                //   phoneInput.current?.isValidNumber(formattedValue);
                // setValid(checkValid!);
                console.log("data error:", data);
                setSubmitted(true);
              }
            )}
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                className="text-gray-400 dark:text-white"
              />
            ) : (
              <Text className="text-2xl font-semibold">Sign Up</Text>
            )}
          </Pressable>
          <Text className="text-right dark:text-white">
            Have an account?{" "}
            <Link href={`/(auth)/SignIn`} className="underline dark:text-white">
              <Text>Sign In?</Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Auth;
