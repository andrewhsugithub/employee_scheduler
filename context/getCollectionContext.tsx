import { createContext, useContext, useEffect, useState } from "react";
import {
  DocumentData,
  QuerySnapshot,
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, type User as AuthUser } from "firebase/auth";
import { useCheckConnectionContext } from "./checkConnectionContext";

interface CollectionType {
  userList?: { id: string; name: string }[];
  userLoading?: boolean;
  currentUserData?: DocumentData;
  tripIdList?: Record<string, any>;
  currentAuth?: AuthUser;
  authLoading?: boolean;
}

const GetCollectionContext = createContext<CollectionType | null>(null);

export const useGetCollectionContext = () => {
  const context = useContext(GetCollectionContext);
  if (!context) {
    throw new Error(
      "useGetCollectionContext must be used within a GetCollectionContextProvider"
    );
  }
  return context;
};

export const GetCollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isConnected } = useCheckConnectionContext();
  const [currentAuth, setCurrentAuth] = useState<AuthUser>({} as AuthUser);
  const [authLoading, setAuthLoading] = useState(true);
  const auth = getAuth().currentUser;
  useEffect(() => {
    const localAuth = async () => {
      await AsyncStorage.setItem("currentUser", JSON.stringify(auth));
      setCurrentAuth(auth!);
      setAuthLoading(false);
    };
    if (!isConnected) return; // if connected => return
    localAuth();
  }, []);

  useEffect(() => {
    const getLocalAuth = async () => {
      const localAuth = await AsyncStorage.getItem("currentUser");
      const auth = JSON.parse(localAuth!);
      setCurrentAuth(auth);
    };
    if (isConnected) return;
    getLocalAuth();
  }, []);

  const [userList, setUserList] = useState<{ id: string; name: string }[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [tripIdList, setTripIdList] = useState<Record<string, any>>([]);
  const [currentUserData, setCurrentUserData] = useState<DocumentData>({});

  const updateLocalUsers = async (snapshot: DocumentData) => {
    let allUsers: User[] = [];
    snapshot?.forEach((user: any) => {
      allUsers.push({ id: user.id, name: user.data().name });
    });
    // console.log("allUsers: ", allUsers);
    await AsyncStorage.setItem("allUsers", JSON.stringify(allUsers));
    setUserLoading(false);
  };

  const updateCurrentLocalUser = async (userData: DocumentData) => {
    await AsyncStorage.setItem(auth?.uid!, JSON.stringify(userData));
    if (Object.keys(userData.trips).length === 0) return;
    let tripList: Record<string, any> = {};
    Promise.all(
      userData.trips?.map(async (trip: any) => {
        await AsyncStorage.setItem("trips_" + trip.id, JSON.stringify({}));
        tripList[trip.id] = {};
      })
    );
    setTripIdList(tripList);
  };

  // users collection
  useEffect(() => {
    if (!isConnected) return;
    const ref = collection(db, "users");
    const unsubscribe = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (usersSnapshot) => {
        const userList: User[] = [];

        usersSnapshot?.forEach((user: any) => {
          userList.push({ id: user.id, name: user.data()?.name });
          if (user.id === auth?.uid) {
            setCurrentUserData(user.data());
            updateCurrentLocalUser(user.data());
          }
        });
        setUserList(userList);
        updateLocalUsers(usersSnapshot);
      }
    );

    return () => unsubscribe();
  }, []);

  // TODO: hopefully there is a better way than to get all job ids
  const updateLocalJobs = async (
    jobsSnapshot: QuerySnapshot<DocumentData, DocumentData>
  ) => {
    const jobIds: string[] = [];
    jobsSnapshot?.forEach((job: any) => jobIds.push(job.id));
    Promise.all(
      jobIds.map(
        async (jobId) =>
          await AsyncStorage.setItem("jobs_" + jobId, JSON.stringify({}))
      )
    );
  };

  useEffect(() => {
    if (!isConnected) return;
    const ref = collection(db, "jobs");
    const unsubscribe = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (jobsSnapshot) => {
        console.log("jobsSnapshot:", jobsSnapshot);
        updateLocalJobs(jobsSnapshot);
      }
    );
    return () => unsubscribe();
  }, []);

  //! no wifi => get local user collection
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await AsyncStorage.getItem("allUsers");
      setUserList(JSON.parse(allUsers!));
      // console.log("users:", JSON.parse(allUsers!));
      const localUser = await AsyncStorage.getItem("currentUser");
      const userId = JSON.parse(localUser!).uid;
      const userData = await AsyncStorage.getItem(userId!);
      setCurrentUserData(JSON.parse(userData!));

      let tripList: Record<string, any> = {};
      if (Object.keys(JSON.parse(userData!).trips).length !== 0) {
        JSON.parse(userData!).trips?.map(async (trip: any) => {
          tripList[trip.id] = {};
        });
      }
      setTripIdList(tripList);
      setUserLoading(false);
    };
    if (isConnected) return;
    console.log("not supposed to be here if have wifi");
    getUsers();
  }, []);

  return (
    <GetCollectionContext.Provider
      value={{
        currentUserData,
        userList,
        userLoading,
        tripIdList,
        currentAuth,
      }}
    >
      {children}
    </GetCollectionContext.Provider>
  );
};
