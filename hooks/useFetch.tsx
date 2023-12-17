import { useEffect, useState } from "react";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";

const useFetch = (
  ref: DocumentReference | CollectionReference,
  isDoc: boolean
) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DocumentData>();

  useEffect(() => {
    if (!isDoc) return;
    const unsubscribe = onSnapshot(
      ref as DocumentReference,
      { includeMetadataChanges: true },
      (userDoc) => {
        // console.log("new");
        setData(userDoc.data());
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDoc) return;
    const unsubscribe = onSnapshot(
      ref as CollectionReference,
      { includeMetadataChanges: true },
      (usersSnapshot) => {
        // console.log("change");
        setData(usersSnapshot);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { loading, data };
};

export default useFetch;
