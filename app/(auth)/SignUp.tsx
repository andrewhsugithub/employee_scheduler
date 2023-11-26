import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import PhoneInput from "react-native-phone-number-input";
import { type AuthFormSchema, AuthSchema } from "@/lib/validations/authSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";

// const phoneUtil = PhoneNumberUtil.getInstance();

const Auth = () => {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);

  // sign in process here
  const SignUp = async (data: AuthFormSchema) => {
    setIsSubmitting(true);

    // TODO: need to format phone number ex: omit (09)
    const phone = `+${phoneInput.current?.getCallingCode()} ${value}`;

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
        email: data.email,
        phone_number: phone,
        created_at: new Date().toUTCString(),
      };
      console.log("user: ", user);

      await setDoc(doc(db, "users", userCredential.user.uid), user);

      // await sendEmailVerification(userCredential.user);
      alert("Sent verification email, please verify your email to sign in");
    } catch (err) {
      console.log(err);
      alert(err);
    }

    // const usersRef = collection(db, "users");
    // try {
    //   await addDoc(usersRef, user);
    // } catch (err) {
    //   console.log(err);
    // }
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

  return (
    <SafeAreaView className="h-screen flex items-center justify-center">
      <View className="h-full flex-1 w-1/2">
        <Text className="text-2xl text-black font-extrabold">Sign Up Form</Text>

        <Text>我想用成手機綁定個人帳號</Text>
        <Controller
          control={control}
          name="username"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="flex flex-row py-2">
                <TextInput
                  placeholder="Name"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  className="border border-black bg-gray-200 flex-1 text-center rounded-full py-2"
                />
              </View>
            );
          }}
        />
        {errors?.username?.message && <Text>{errors?.username?.message}</Text>}
        <Controller
          control={control}
          name="email"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="flex flex-row py-2">
                <TextInput
                  placeholder="Email"
                  onBlur={onBlur}
                  value={value}
                  inputMode="email"
                  onChangeText={onChange}
                  className="border border-black bg-gray-200 flex-1 text-center rounded-full py-2"
                />
              </View>
            );
          }}
        />
        {errors?.email?.message && <Text>{errors?.email?.message}</Text>}
        <Controller
          control={control}
          name="password"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="flex flex-row py-2">
                <TextInput
                  placeholder="Password"
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry
                  onChangeText={onChange}
                  className="border border-black bg-gray-200 flex-1 text-center rounded-full py-2"
                />
              </View>
            );
          }}
        />
        {errors?.password?.message && <Text>{errors?.password?.message}</Text>}
        <Controller
          control={control}
          name="confirmPassword"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="flex flex-row py-2">
                <TextInput
                  placeholder="Confirm Password"
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry
                  onChangeText={onChange}
                  className="border border-black bg-gray-200 flex-1 text-center rounded-full py-2"
                />
              </View>
            );
          }}
        />
        {errors?.confirmPassword?.message && (
          <Text>{errors?.confirmPassword?.message}</Text>
        )}
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

        <Pressable
          className="bg-green-500 p-4 rounded-full items-center"
          onPress={handleSubmit(
            (data) => {
              const checkValid =
                phoneInput.current?.isValidNumber(formattedValue);
              setValid(checkValid!);
              setSubmitted(true);
              if (!checkValid) return;
              SignUp(data);
            },
            () => {
              const checkValid =
                phoneInput.current?.isValidNumber(formattedValue);
              setValid(checkValid!);
              setSubmitted(true);
            }
          )}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" className="text-gray-400" />
          ) : (
            <Text>Sign Up</Text>
          )}
        </Pressable>
        <Text className="text-right">
          Have an account?{" "}
          <Link href={`/(auth)/SignIn`} className="underline">
            <Text>Sign In?</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Auth;
