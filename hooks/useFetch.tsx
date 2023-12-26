import { useEffect, useState } from "react";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { useCheckConnectionContext } from "@/context/checkConnectionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetch = (
  ref: DocumentReference | CollectionReference,
  isDoc: boolean,
  refName?: string,
  docId?: string,
  jobIds?: string
) => {
  const { isConnected } = useCheckConnectionContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DocumentData>();

  const updateLocalDoc = async (
    refName: string,
    needToUpdateData: DocumentData
  ) => {
    const collection = await AsyncStorage.getItem(refName + "_" + docId);
    let collectionObj = JSON.parse(collection!);
    collectionObj = { ...collectionObj, ...needToUpdateData };
    await AsyncStorage.setItem(
      refName + "_" + docId!,
      JSON.stringify(collectionObj)
    );
    setLoading(false);
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
        updateLocalDoc(refName!, doc.data()!);
      }
    );
    return () => unsubscribe();
  }, []);

  // local doc
  useEffect(() => {
    const getDoc = async () => {
      const doc = await AsyncStorage.getItem(refName! + "_" + docId!);
      setData(JSON.parse(doc!));
      console.log("fetched data no wifi: ", JSON.parse(doc!), "id:", docId!);
      setLoading(false);
    };
    if (isConnected || !isDoc) return;
    console.log("get doc not supposed to be here if have wifi");
    getDoc();
  }, []);

  return { loading, data };
};

export default useFetch;
