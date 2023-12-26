import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  useColorScheme,
  KeyboardAvoidingView,
} from "react-native";
import {
  CollectionReference,
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  type RegisterFormSchema,
  RegisterSchema,
  type JobFormSchema,
} from "@/lib/validations/registerSchema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddCrewPage from "./AddCrewPage";
import AddJobPage from "./AddJobPage";
import RegisterTripInfo from "./RegisterTripInfo";
import { Button, Dialog, Portal, PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetCollectionContext } from "@/context/getCollectionContext";

interface RegisterTripProps {
  show: boolean;
  handleShow: (showModal: boolean) => void;
}

const RegisterTrip = ({ show, handleShow }: RegisterTripProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("error");
  const [visible, setVisible] = useState(false);

  const { currentAuth } = useGetCollectionContext();
  const captainId = currentAuth?.uid;
  const colorScheme = useColorScheme();

  const { userLoading: loadUsers, userList: allUsers } =
    useGetCollectionContext();

  const addJob = async (
    jobRef: CollectionReference,
    jobData: JobFormSchema
  ) => {
    const job = {
      expected_starting_datetime: jobData.startDate,
      expected_ending_datetime: jobData.endDate,
      job_name: jobData.jobName,
      real_starting_datetime: null,
      real_ending_datetime: null,
      is_present: false,
      is_late: true, // if >10min=>late
      has_complete_job: false,
      has_worked_overtime: false,
    };

    try {
      const addedJob = await addDoc(jobRef, job);
      //* put jobs into local storage
      await AsyncStorage.setItem("jobs_" + addedJob.id, JSON.stringify(job));

      return { id: addedJob.id, start_date: jobData.startDate };
    } catch (err: any) {
      console.log(err);
      setShowError(true);
      setError(err.message);
    }
  };

  const registerTrip = async (data: RegisterFormSchema) => {
    const jobRef = collection(db, "jobs");
    const captainJobInfo = await Promise.all(
      data.captain_job.map(async (job: JobFormSchema) => {
        const jobInfo = await addJob(jobRef, job);
        if (jobInfo !== undefined) return jobInfo!;
      })
    );

    const crewInfo = await Promise.all(
      data.crew.map(async (crew: any) => {
        const crewJobInfo = await Promise.all(
          crew.crew_job.map(async (job: JobFormSchema) => {
            const jobInfo = await addJob(jobRef, job);
            if (jobInfo !== undefined) return jobInfo!;
          })
        );
        return {
          crew_id: crew.crew_id,
          crew_jobs: crewJobInfo,
          crew_name:
            allUsers![
              allUsers!.findIndex((user: User) => user.id === crew.crew_id)
            ]?.name,
          crew_pass: Math.random().toString(36).slice(-8),
          crew_aboard_time: null,
          crew_offboard_time: null,
          has_crew_verified: false,
        };
      })
    );

    const trip = {
      trip_name: data.trip_name,
      captain_id: captainId,
      captain_name:
        allUsers![allUsers!.findIndex((user: User) => user.id === captainId!)]
          ?.name,
      captain_job: captainJobInfo,
      has_captain_verfied: false,
      captain_pass: Math.random().toString(36).slice(-8),
      captain_aboard_time: null,
      captain_offboard_time: null,
      location: data.location,
      start_date: data.startDate,
      end_date: data.endDate,
      crew: crewInfo,
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString(),
    };

    try {
      const tripsRef = collection(db, "trips");
      const addedTrip = await addDoc(tripsRef, trip);
      //* put into trip local storage
      await AsyncStorage.setItem("trips_" + addedTrip.id, JSON.stringify(trip));

      const userRef = doc(db, "users", captainId!);
      await updateDoc(userRef, {
        trips: arrayUnion({
          id: addedTrip.id,
          start_date: data.startDate,
          end_date: data.endDate,
        }),
      });
      //* put into current user local storage
      const localStringifyCurrentUserRef = await AsyncStorage.getItem(
        captainId!
      );
      const localCurrentUserRef = JSON.parse(localStringifyCurrentUserRef!);
      await AsyncStorage.setItem(
        captainId!,
        JSON.stringify({
          ...localCurrentUserRef,
          trips: [
            ...localCurrentUserRef.trips,
            {
              id: addedTrip.id,
              start_date: data.startDate,
              end_date: data.endDate,
            },
          ],
        })
      );

      data.crew.map(async (crew: any, index) => {
        const userRef = doc(db, "users", crew.crew_id!);
        await updateDoc(userRef, {
          trips: arrayUnion({
            id: addedTrip.id,
            start_date: data.startDate,
            end_date: data.endDate,
          }),
        });
        //* put into user local storage i don't care because it isn't me
        // const localStringifyCrewRef = await AsyncStorage.getItem(
        //   crew[index].crew_id
        // );
        // const localCrewRef = JSON.parse(localStringifyCrewRef!);
        // await AsyncStorage.setItem(
        //   crew[index].crew_id,
        //   JSON.stringify({
        //     ...localCrewRef,
        //     trips: [
        //       ...localCrewRef.trips,
        //       {
        //         id: addedTrip.id,
        //         start_date: data.startDate,
        //         end_date: data.endDate,
        //       },
        //     ],
        //   })
        // );
      });
      reset({ ...data });
      console.log("success", trip);
      handleShow(false);
    } catch (err: any) {
      console.log("err: ", err);
      setShowError(true);
      setError(err.message);
    }
    setPageIndex(0);
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const { fields, prepend, remove } = useFieldArray({
    name: "crew",
    control,
  });

  if (showError) {
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    return (
      <PaperProvider>
        <View>
          <Button onPress={showDialog}>
            <Text className="text-base text-white">Show Error</Text>
          </Button>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Error</Dialog.Title>
              <Dialog.Content>
                <Text className="text-base text-white">{error}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>
                  <Text className="text-base text-white">Hide</Text>
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </PaperProvider>
    );
  }

  return (
    <Modal animationType="slide" visible={show} presentationStyle="pageSheet">
      <KeyboardAvoidingView behavior={"padding"} className="flex-1">
        <View
          className={`p-16 flex flex-1 items-center justify-between bg-white dark:bg-slate-800`}
        >
          <Text className="text-center font-bold text-3xl py-5 dark:text-white">
            Register Form
          </Text>
          <View className="w-full flex flex-row items-center justify-center">
            <AntDesign
              name="caretleft"
              size={24}
              color={`${colorScheme === "dark" ? "white" : "black"}`}
              onPress={() => {
                setPageIndex(() => {
                  return pageIndex === 0 ? pageIndex : pageIndex - 1;
                });
              }}
            />
            <View className={`flex-1 ${pageIndex === 0 ? "p-2 " : "hidden"}`}>
              <RegisterTripInfo control={control} errors={errors} />
            </View>
            {/* ADD CREW FORM PAGE 2 */}
            <View className={`flex-1 ${pageIndex === 1 ? "p-2 " : "hidden"}`}>
              <AddCrewPage
                fields={fields}
                prepend={prepend}
                remove={remove}
                users={allUsers! as User[]}
              />
            </View>
            {/* ADD JOB FORM PAGE 3 */}
            <View className={`flex-1 ${pageIndex === 2 ? "p-2 " : "hidden"}`}>
              <AddJobPage
                control={control}
                errors={errors}
                crewArray={fields}
                users={allUsers! as User[]}
              />
            </View>
            <AntDesign
              name="caretright"
              size={24}
              color={`${colorScheme === "dark" ? "white" : "black"}`}
              onPress={() => {
                setPageIndex(() => {
                  return pageIndex === 2 ? pageIndex : pageIndex + 1;
                });
              }}
            />
          </View>
          <View>
            <Pressable
              className="bg-blue-300 rounded-full p-3"
              onPress={handleSubmit(registerTrip, (data) =>
                console.log("error:", data)
              )}
            >
              {isSubmitting ? (
                <ActivityIndicator size="large" className="text-gray-400" />
              ) : (
                <Text className="text-center text-xl px-2">Register</Text>
              )}
            </Pressable>
            <View className="p-4 items-center flex-row justify-center gap-x-4 dark:bg-slate-800">
              {[0, 1, 2].map((item, idx) => (
                <Pressable
                  key={idx}
                  className={`w-2 h-2 rounded-full
                ${
                  pageIndex === idx ? "bg-black dark:bg-white" : "bg-gray-400"
                }`}
                  onPress={() => setPageIndex(idx)}
                ></Pressable>
              ))}
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => handleShow(false)}
          className="absolute top-7 right-7"
        >
          <MaterialIcons
            name="close"
            color={`${colorScheme === "dark" ? "white" : "black"}`}
            size={22}
          />
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RegisterTrip;
