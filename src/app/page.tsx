"use client";
import { useState, useMemo } from "react";
import firebase_app from "../../config";
import { getAuth } from "firebase/auth";
import { useTable, useSortBy } from "react-table";
import {
  getTags,
  getHtml,
  getTextContent,
  getDescriptionFromChatGPT,
} from "@/helpers/helpers";
import { MetaTags } from "@/types";
import { db } from "../firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [tags, settags] = useState<MetaTags[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showTable, setShowTable] = useState(false);
  const auth = getAuth(firebase_app);
  const user = auth.currentUser;
  console.log({ loggedInUser: user?.email });
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Content", accessor: "content" },
      { Header: "Chat GPT Notes", accessor: "chatGptNotes" },
      { Header: "Chat GPT Suggestion", accessor: "chatGptSuggestion" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tags }, useSortBy);
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
        console.log("fetchedTags:", fetchedTags);

        const textContent = await getTextContent(html);
        console.log("getTextContent:", textContent);

        const descriptionFromChatGPT = await getDescriptionFromChatGPT(
          textContent
        );
        console.log("descriptionFromChatGPT:", descriptionFromChatGPT);

        fetchedTags.push({
          name: "generatedDescription",
          content: descriptionFromChatGPT ?? "",
        });
        settags(fetchedTags);
        setShowTable(true); // Set the state to show the table

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

      {/* <div>
        {tags &&
          tags.map(function (d, idx) {
            return (
              <li key={idx}>
                {d.name} {d.property} : {d.content}
              </li>
            );
          })}
      </div> */}
      {tags.length > 0 && (
        <button
          type="button"
          onClick={exportTagsAsJSON}
          className="mt-4 p-2 rounded cursor-pointer"
        >
          Load Results
        </button>
      )}

      {showTable && (
        <div>
          <table
            {...getTableProps()}
            className="w-full border-collapse border rounded"
          >
            <thead>
              {headerGroups.map((headerGroup, idx) => (
                <tr {...(headerGroup.getHeaderGroupProps(), { key: idx })}>
                  {headerGroup.headers.map((column, idx) => (
                    <th
                      className="p-2 border"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, idx) => {
                prepareRow(row);
                return (
                  <tr
                    className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    {...(row.getRowProps(), { key: idx })}
                  >
                    {row.cells.map((cell) => (
                      <td className="p-2 border" {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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
