import { Link, useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { auth } from "@/lib/firebase";
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
import { useEffect } from "react";

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
        // if (!user.emailVerified) alert("Please verify your email first");
        router.push(`/(drawer)/${user.displayName}/MyTrips`);
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

  return (
    <SafeAreaView className="h-screen flex items-center justify-center">
      <View className="h-full flex-1 w-1/2">
        <Text className="text-2xl text-black font-extrabold">Sign In Form</Text>
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
                  keyboardType="email-address"
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

        <Pressable
          className="bg-green-500 p-4 rounded-full items-center"
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
