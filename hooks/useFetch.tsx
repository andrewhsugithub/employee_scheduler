import { useEffect, useState } from "react";
import {
  DocumentData,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";

const useFetch = (ref: DocumentReference) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DocumentData>();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (userDoc) => {
        console.log("new");
        setData(userDoc.data());
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { loading, data };
};

export default useFetch;
