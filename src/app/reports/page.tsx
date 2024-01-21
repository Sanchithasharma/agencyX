"use client";
import signUp from "../../firebase/signup";
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from "react";
import { db }  from "../../firebase/firestore";
import { collection, doc, getDoc } from "firebase/firestore"; 


export default function Report() {
    useEffect(() => {
        const fetchData = async () => {
            const getRef = doc(db, "evgenia@mail.com", "heroicons.com%252F");
            const docSnap = await getDoc(getRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        };
        fetchData();
    })

    return(
        <div>
            <h1>Report</h1>
        </div>
    )
}

