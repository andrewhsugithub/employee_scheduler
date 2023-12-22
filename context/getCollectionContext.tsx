import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { DocumentData, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCheckConnectionContext } from "./checkConnectionContext";
import { getAuth, type User as AuthUser } from "firebase/auth";

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

  const updateLocalUsers = async (
    snapshot: DocumentData,
    idList: Record<string, any>
  ) => {
    let allUsers: User[] = [];
    snapshot?.forEach((user: any) => {
      allUsers.push({ id: user.id, name: user.data().name });
    });
    console.log("allUsers: ", allUsers);
    await AsyncStorage.setItem("allUsers", JSON.stringify(allUsers));
    await AsyncStorage.setItem("trips", JSON.stringify(idList));

    // const trip = await AsyncStorage.getItem("trips");
    // const tripObj = JSON.parse(trip!);
    // console.log("idList: ", idList, "allUsers: ", allUsers, "trip: ", tripObj);
  };

  const updateCurrentLocalUser = async (userData: DocumentData) => {
    await AsyncStorage.setItem(auth?.uid!, JSON.stringify(userData));
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
        let tripList: Record<string, any> = {};
        usersSnapshot?.forEach((user: any) => {
          userList.push({ id: user.id, name: user.data().name });
          if (user.id === auth?.uid) {
            user.data().trips.map((trip: any) => (tripList[trip.id] = {}));
            setCurrentUserData(user.data());
            updateCurrentLocalUser(user.data());
          }
        });
        setUserList(userList);
        setTripIdList(tripList);
        updateLocalUsers(usersSnapshot, tripList).then(() =>
          setUserLoading(false)
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // get local user collection
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await AsyncStorage.getItem("allUsers");
      setUserList(JSON.parse(allUsers!));
      console.log("users:", JSON.parse(allUsers!));
      const tripIds = await AsyncStorage.getItem("trips");
      setTripIdList(JSON.parse(tripIds!));
      console.log("tripid:", JSON.parse(tripIds!));
      const localUser = await AsyncStorage.getItem("currentUser");
      const userId = JSON.parse(localUser!).uid;
      const userData = await AsyncStorage.getItem(userId!);
      setCurrentUserData(JSON.parse(userData!));
      setUserLoading(false);
    };
    if (isConnected) return;
    console.log("not supposed to be here if have wifi");
    getUsers();
  }, []);

  // TODO: hopefully there is a better way than to get all job ids
  const updateLocalJobs = async (jobIdList: Record<string, any> = {}) =>
    await AsyncStorage.setItem("jobs", JSON.stringify(jobIdList));

  useEffect(() => {
    if (!isConnected) return;
    const ref = collection(db, "jobs");
    const unsubscribe = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (jobsSnapshot) => {
        // console.log("change");
        let jobIdList: Record<string, any> = {};
        jobsSnapshot?.forEach((job: any) => (jobIdList[job.id] = {}));
        updateLocalJobs(jobIdList);
      }
    );

    return () => unsubscribe();
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
