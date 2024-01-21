"use client";
import { useState } from "react";
import firebase_app from "../../config";
import { getAuth } from "firebase/auth";
import { getTags, getHtml, createChatGPTReport } from "@/helpers/helpers";
import { MetaTags } from "@/types";
import { db } from "../firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

export const maxDuration = 60;

export default function Home() {
  const [tags, settags] = useState<MetaTags[]>([]);
  const [report, setReport] = useState<string>('');
  const [urlInput, setUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth(firebase_app);
  const user = auth.currentUser;
  console.log({ loggedInUser: user?.email });

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
        const generatedReport = await createChatGPTReport(fetchedTags) as string;
        console.log("generated report:", generatedReport)
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className="mt-8">
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
          className="mt-4 p-2 rounded cursor-pointer"
        >
          Generate Report
        </button>
      </form>
      {errorMessage && <p className="mt-2">{errorMessage}</p>}

      <div>
        {report &&
            <>
            <h2>Report</h2>
            <div>{report}</div>
            </>
          }
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
    </main>
  );
}
