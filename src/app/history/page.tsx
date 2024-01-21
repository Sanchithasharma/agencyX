"use client";
import login from "../../firebase/login";
import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";

import { DialogBox } from "../../components/dialog";

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

export default function History() {
  const [open, setOpen] = useState(false);


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
            {QUERY_DATA.map((el, i) => (
              <tr key={i}>
                <td className="p-2 border-b border-l text-left">{el.documentId}</td>
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
                <DialogBox open={open} handleClose={() => setOpen(false)} body={el.metaTags}/>
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
