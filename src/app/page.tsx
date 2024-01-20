"use client";
import { useState } from "react";
import firebase_app from "../../config";
import { getAuth } from "firebase/auth";

import { getTags, getHtml, getTextContent, getDescriptionFromChatGPT } from "@/helpers/helpers";
import { MetaTags } from "@/types";

export default function Home() {
  const [tags, settags] = useState<MetaTags[]>([]);
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
        settags(fetchedTags);
        console.log(fetchedTags);

        // clean html before passing to chatGPT
        const textContent = await getTextContent(html);
        console.log("getTextContent:", textContent )

        const descriptionFromChatGPT = await getDescriptionFromChatGPT(textContent)
        console.log("descriptionFromChatGPT:", descriptionFromChatGPT )


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

    const tagsJSON =JSON.stringify(tags, null, 2);

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
        {tags &&
          tags.map(function (d, idx) {
            return (
              <li key={idx}>
                {d.name} {d.property} : {d.content}
              </li>
            );
          })}
      </div>
      {tags.length > 0 && (<button type="button" onClick={exportTagsAsJSON} className="mt-4 p-2 rounded cursor-pointer">Load Results</button>)}

    </main>
  );
}
