"use client";
import login from "../../firebase/login";
import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";

const TABLE_HEADER = ["URL", "View"];

const FETCHED_DATA = [
  "https://www.jmrlawyers.com.au/page-sitemap.xml",
  "https://www.jmrlawyers.com.au/page-sitemap.xml",
  "https://www.jmrlawyers.com.au/page-sitemap.xml",
];

export default function Login() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1>Past Reports</h1>

      <div className="p-8">
        <table className="table-auto border p-2">
          <thead>
            <tr>
              {TABLE_HEADER.map((key, i) => (
                <th className="font-bold py-2 px-4 border-b border-l text-center" key={i}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FETCHED_DATA.map((el, i) => (
              <tr key={i}>
                <td className="p-2 border-b border-l text-left">
                  {el}
                </td>
                <td className="p-2 border-b border-l text-left">
                    <a href={el}>
                        View
                    </a>
                </td>
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
