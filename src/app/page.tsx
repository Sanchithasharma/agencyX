"use client";
import { useEffect, useState } from "react";
import firebase_app from "../../config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getTags, getHtml, createChatGPTReport } from "@/helpers/helpers";

import { MetaTags } from "@/types";
import { signOut } from "../firebase/signout";
import { db } from "../firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

export const maxDuration = 60;

export default function Home() {
  const [tags, settags] = useState<MetaTags[]>([]);
  const [report, setReport] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(getAuth(firebase_app).currentUser);
  const auth = getAuth(firebase_app);

  const router = useRouter();
  console.log({ loggedInUser: user?.email });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("loggedInUser");
      }
      setUser(user);
      if (!user) {
        router.push("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);

  const validateAndSubmit = async () => {
    // Basic URL validation
    const urlPattern = /^(http|https):\/\/[^ "]+$/;

    if (!urlInput || !urlPattern.test(urlInput)) {
      setErrorMessage("Please enter a valid URL");
    } else {
      setErrorMessage("");
      console.log("Fetching meta tags for:", urlInput);

      const html = await getHtml(urlInput);
      if (html) {
        const fetchedTags = await getTags(html);
        const generatedReport = (await createChatGPTReport(
          fetchedTags
        )) as string;
        console.log("generated report:", generatedReport);
        settags(fetchedTags);
        setReport(generatedReport);

        if (user) {
          // write to firestore
          const res = await setDoc(
            doc(
              db,
              // for our user document
              user.email!,
              // create an entry which is the url
              encodeURIComponent(
                urlInput.replace(/^(http:\/\/|https:\/\/)/, "")
              )
            ),
            // that entry will have metaTags as their data
            {
              metaTags: fetchedTags,
            }
          );
          console.log("SUCCESFULLY UPDATED DATABASE", res);
        }
      } else {
        console.log("Failed to fetch HTML content.");
        return null;
      }
    }
  };
  const handleLogout = async () => {
    try {
      await signOut();
      // The onAuthStateChanged will handle updating the user state
      // and redirecting if necessary.
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const exportTagsAsJSON = () => {
    if (tags.length === 0) {
      setErrorMessage("No meta tags found.");
      return;
    }

    const tagsJSON = JSON.stringify(tags, null, 2);

    const blob = new Blob([tagsJSON], { type: "application/json" });

    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "meta-tags.json";
    anchor.click();
  };

  return (
    <main className="flex min-h-screen flex-col items-stretch justify-between p-24">
      <div className="p-4 text-center text-4xl text-brown-400 mb-10">
        Intellitag
      </div>

      <form className="mt-8 flex flex-col gap-6 items-center">
        <label className="block mb-2" htmlFor="urlInput">
          Enter Your Website URL:
        </label>
        <input
          type="url"
          id="urlInput"
          name="urlInput"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          required
          placeholder="Enter a valid URL"
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={validateAndSubmit}
          className="bg-brown-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[300px] self-center"
        >
          Generate Report
        </button>
      </form>
      {errorMessage && <p className="mt-2">{errorMessage}</p>}

      <div>
        {report && (
          <>
            <h2>Report</h2>
            <div>{report}</div>
          </>
        )}
        {/* {tags &&
          tags.map(function (d, idx) {
            return (
              <li key={idx}>
                {d.name} {d.property} : {d.content}
              </li>
            );
          })} */}
      </div>
      {tags.length > 0 && (
        <button
          type="button"
          onClick={exportTagsAsJSON}
          className="mt-4 p-2 rounded cursor-pointer"
        >
          Load Results
        </button>
      )}

      {user && (
        <button
          type="button"
          onClick={handleLogout}
          className="bg-brown-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center w-[150px]"
        >
          Logout
        </button>
      )}
    </main>
  );
}
