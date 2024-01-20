"use server";
import { MetaTags, TagInfo } from "@/types";

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



async function get_website_info(html: string, paragraph_tag: string): Promise<TagInfo[]> {
    try {
        // Create a DOM from the HTML string using jsdom
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // Select all tags of the specified type
        const tags = doc.querySelectorAll(paragraph_tag);

        // Initialize an array to store the extracted information
        const tagInfoArray: TagInfo[] = [];

        // Iterate through the selected tags
        tags.forEach((tag: Element, idx: Element) => {
            // Extract information from the tag (adjust this part based on your needs)
            const tagInfo: TagInfo = {
                // Example: Extracting the text content of the tag
                content: tag.textContent?.trim() || '',

                // You can add more properties based on your requirements
            };

            // Add the extracted information to the array
            tagInfoArray.push(tagInfo);
        });

        // Return the array containing the extracted information
        return tagInfoArray;
    } catch (error) {
        // Handle errors
        console.error('Error in get_website_info:', error);
        throw error;
    }
}

export { getTags, getHtml, get_website_info };
