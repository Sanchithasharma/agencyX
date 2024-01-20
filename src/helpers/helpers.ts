"use server";
import { MetaTags } from "@/types";

const { JSDOM } = require("jsdom");

async function getHtml(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const html = await response.text();
        return html;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

async function getTags(html: string): Promise<MetaTags[]> {
    try {
        // Create a DOM from the HTML string using jsdom
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // Query the document for all meta tags
        const metaTags = doc.querySelectorAll("meta");

        // Create an array to store the meta tag attributes
        const metaTagAttributes: Array<{ [key: string]: string }> = [];

        // Loop through each meta tag and extract attributes
        metaTags.forEach((tag: Element) => {
            const attributes: { [key: string]: string } = {};
            tag.getAttributeNames().forEach((attributeName: string) => {
                attributes[attributeName] = tag.getAttribute(attributeName) || "";
            });
            metaTagAttributes.push(attributes);
        });

        return metaTagAttributes;
    } catch (error) {
        console.error("Error parsing HTML:", error);
        return [];
    }
}


export { getTags, getHtml };
