import { Link, useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
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

// const phoneUtil = PhoneNumberUtil.getInstance();

const SignIn = () => {
  const router = useRouter();

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) router.push(`/(drawer)/${user.displayName}/MyTrips`);
    console.log("user: ", user);
  }, []);

  // TODO: sign in process here
  const handleSignIn = async (data: SignInFormSchema) => {
    await signInWithEmailAndPassword(auth, data.email.trim(), data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) alert("Please verify your email first");
        else router.push(`/(drawer)/${user.displayName}/MyTrips`);
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
    <SafeAreaView className="h-screen flex items-center justify-center ">
      <View className="h-full flex-1 w-1/2">
        <Text className="text-2xl text-black font-extrabold mt-64">
          Sign In Form
        </Text>
        <Controller
          control={control}
          name="email"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View className="flex flex-row p-2">
                <TextInput
                  label={"📫Email"}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  value={value}
                  inputMode="email"
                  onChangeText={onChange}
                  mode="outlined"
                  className=" flex-1 rounded-full"
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
              <View className="flex flex-row p-2 ">
                <TextInput
                  label="🔒Password"
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={passwordVisible}
                  onChangeText={onChange}
                  mode="outlined"
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? "eye" : "eye-off"}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                  className=" flex-1 rounded-full mb-8"
                />
              </View>
            );
          }}
        />
        {errors?.password?.message && <Text>{errors?.password?.message}</Text>}

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
        <Text className="text-right">
          Don't have an account?{" "}
          <Link href={`/(auth)/SignUp`} className="underline">
            <Text>Sign Up?</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
