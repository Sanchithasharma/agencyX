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

async function fetchData(collectionName: string, docName: string) {
    try {
      const collectionRef = collection(db, collectionName);
      const documentRef = doc(collectionRef, docName);
      
      const docSnap = await getDoc(documentRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.log("Error getting document:", e);
    }
  }

export default function Report() {
    useEffect(() => {
        const fetchDataAndNames = async () => {
        const documentNames = await getAllDocumentNames("users");
        console.log({ documentNames });
      
        const userEmail = "b.riwukaho@gmail.com";
        const docName = "console.firebase.google.com%2Fu%2F0%2Fproject%2Fagencyx-851b6%2Fsettings%2Fgeneral";
        const collectionName = userEmail;
        fetchData(collectionName, docName);
        };
      
        fetchDataAndNames();
        }, []); 
      
        return (
          <div>
            <h1>Report</h1>
          </div>
        );
    }
