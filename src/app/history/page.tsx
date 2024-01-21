"use client";
import login from "../../firebase/login";
import { useRouter } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";

import { DialogBox } from "../../components/dialog";
import { db } from "../../firebase/firestore";
import { collection, getDocs, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebase_app from "../../../config";

const TABLE_HEADER = ["URL", "View"];

const QUERY_DATA = [
  {
    documentId:
      "console.firebase.google.com%2Fu%2F0%2Fproject%2Fagencyx-851b6%2Fsettings%2Fgeneral",
    metaTags: [
      {
        content: "origin",
        name: "referrer",
      },
      {
        content: "origin",
        name: "referrer",
      },
    ],
  },
  {
    documentId:
      "stacoverflow.com%2Fquestions%2F69166454%2Ffirestore-v9-expected-first-argument-to-collection-to-be-a-collectionreference	",
    metaTags: [
      {
        content: "origin",
        name: "referrer",
      },
      {
        content: "origin",
        name: "referrer",
      },
    ],
  },
];

async function getAllDocuments(collectionName: string) {
  console.log({ collectionName });
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  const documents = snapshot.docs.map((doc) => {
    return {
      documentId: doc.id,
      metaTags: doc.data(),
    };
  });
  return documents;
}

export default function History() {
  // redirect away from this page, if user is not logged in
  // refer to the implementation on the main app page
  const [documents, setDocuments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchDataAndNames = async () => {
      const loggedInUser = await getAuth(firebase_app);
      console.log({ currentUser: loggedInUser.currentUser });

      // homework, correctly fetch the logged in user
      const fetchedDocuments = await getAllDocuments("b.riwukaho@gmail.com");
      setDocuments(fetchedDocuments);
    };

    fetchDataAndNames();
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1>Past Reports</h1>

      <div className="p-8">
        <table className="table-auto border p-2">
          <thead>
            <tr>
              {TABLE_HEADER.map((key, i) => (
                <th
                  className="font-bold py-2 px-4 border-b border-l text-center"
                  key={i}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((el, i) => (
              <tr key={i}>
                <td className="p-2 border-b border-l text-left">
                  {el.documentId}
                </td>
                <td className="p-2 border-b border-l text-left">
                  <button
                    className="bg-brown-200 py-2 px-6 rounded-lg text-400 hover:bg-wheat"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    View
                  </button>
                </td>
                <DialogBox
                  open={open}
                  handleClose={() => setOpen(false)}
                  body={el.metaTags}
                />
              </tr>
            ))}
            {/* <tr>
              <td className="p-2 border-b text-left">
                The Sliding Mr. Bones (Next Stop, Pottersville)
              </td>
              <td className="p-2 border-b text-left">Malcolm Lockyer</td>
            </tr>
            <tr>
              <td className="p-2 border-b text-left">Witchy Woman</td>
              <td className="p-2 border-b text-left">The Eagles</td>
            </tr>
            <tr>
              <td className="p-2 border-b text-left">Shining Star</td>
              <td className="p-2 border-b text-left">Earth, Wind, and Fire</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </main>
  );
}
