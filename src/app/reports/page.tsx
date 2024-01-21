"use client";
import signUp from "../../firebase/signup";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { db } from "../../firebase/firestore";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

async function getAllDocumentNames(collectionName: string) {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  const documentNames = snapshot.docs.map((doc) => doc.id);
  return documentNames;
}

export default function Report() {
  useEffect(() => {
    const fetchData = async () => {
      const getRef = doc(db, "evgenia@mail.com", "heroicons.com%2F");
      const docSnap = await getDoc(getRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      const docNames = await getAllDocumentNames("evgenia@mail.com");
      console.log("Document names", docNames);
    };

    fetchData();
  });

  return (
    <div>
      <h1>Report</h1>
    </div>
  );
}
