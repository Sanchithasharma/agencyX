"use client";
import { useState } from "react";
import { getTags, getHtml } from "@/helpers/helpers";
import { MetaTags } from "@/types";
export default function Home() {
  const [tags, settags] = useState<MetaTags[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateAndSubmit = async () => {
    // Basic URL validation
    const urlPattern = /^(http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput)) {
      setErrorMessage("Please enter a valid URL");
    } else {
      setErrorMessage("");
      console.log("Fetching meta tags for:", urlInput);

      const html = await getHtml(urlInput);
      if (html) {
        const fetchedTags = await getTags(html);
        settags(fetchedTags);
        console.log(fetchedTags);
      } else {
        console.log("Failed to fetch HTML content.");
        return null;
      }
    }
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
        {tags && tags.map(function (d, idx) { return (<li key={idx}>{d.name} {d.property} : {d.content}</li>) })}
      </div>
    </main>

  );
}
