import { useEffect, useState } from "react";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useCheckConnectionContext } from "@/context/checkConnectionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetch = (
  ref: DocumentReference | CollectionReference,
  isDoc: boolean,
  refName?: string,
  docId?: string
) => {
  const { isConnected } = useCheckConnectionContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DocumentData>();
  const [jobIdList, setJobIdList] = useState<Record<string, any>>({});

  const updateLocalDoc = async (
    refName: string,
    needToUpdateData: DocumentData,
    jobIds?: Record<string, any>
  ) => {
    const collection = await AsyncStorage.getItem(refName);
    let collectionObj = JSON.parse(collection!);
    // update
    collectionObj[docId!] = { ...collectionObj[docId!], ...needToUpdateData };
    // if (refName === "trips") {
    //   const jobCollection = await AsyncStorage.getItem("jobs");
    //   let jobCollectionObj = JSON.parse(jobCollection!);
    //   // update jobs
    //   Object.keys(jobIds!).map((jobId) => {
    //     jobCollectionObj[jobId] = {
    //       ...jobCollectionObj[jobId],
    //       ...jobIds![jobId],
    //     };
    //   });
    //   await AsyncStorage.setItem("jobs", JSON.stringify(jobCollectionObj));

    //   console.log("jobs", Object.keys(jobCollectionObj));
    // }

    // console.log(refName!, Object.keys(collectionObj));
    await AsyncStorage.setItem(refName, JSON.stringify(collectionObj));
  };

  // doc
  useEffect(() => {
    if (!isConnected || !isDoc) return;
    const unsubscribe = onSnapshot(
      ref as DocumentReference,
      { includeMetadataChanges: true },
      (doc) => {
        // console.log("new");
        setData(doc.data());
        //! get job id
        // if (refName === "trips") {
        //   const jobIds: Record<string, any> = {};
        //   // get captain job first
        //   doc.data()?.captain_job?.map((job: any) => (jobIds[job.id] = {}));
        //   // get crew jobs
        //   doc
        //     .data()
        //     ?.crew?.map((crewMember: any) =>
        //       crewMember.crew_jobs?.map((job: any) => (jobIds[job.id] = {}))
        //     );
        //   setJobIdList(jobIds);
        //   updateLocalDoc(refName!, doc.data()!, jobIds).then(() =>
        //     setLoading(false)
        //   );
        // } else
        updateLocalDoc(refName!, doc.data()!).then(() => setLoading(false));
      }
    );
    return () => unsubscribe();
  }, []);

  // local doc
  useEffect(() => {
    const getDoc = async () => {
      const doc = await AsyncStorage.getItem(refName!);
      setData(JSON.parse(doc!)[docId!]);
      console.log("fetched data: ", JSON.parse(doc!)[docId!]);
      setLoading(false);
    };
    if (isConnected || !isDoc) return;
    console.log("get doc not supposed to be here if have wifi");
    getDoc();
  }, []);

  return { loading, data };
};

export default useFetch;
