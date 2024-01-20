const fetch = require('isomorphic-fetch');
const { JSDOM } = require('jsdom');

async function getHtml(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function getTags(html) {
    try {
        // Create a DOM from the HTML string using jsdom
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // Query the document for all meta tags
        const metaTags = doc.querySelectorAll('meta');

        // Create an array to store the meta tag attributes
        const metaTagAttributes = [];

        // Loop through each meta tag and extract attributes
        metaTags.forEach(tag => {
            const attributes = {};
            tag.getAttributeNames().forEach(attributeName => {
                attributes[attributeName] = tag.getAttribute(attributeName);
            });
            metaTagAttributes.push(attributes);
        });

        return metaTagAttributes;
    } catch (error) {
        console.error('Error parsing HTML:', error);
        return null;
    }
}

// Example usage:
const url = 'https://www.news.com.au';
getHtml(url)
    .then(html => {
        if (html) {
            return getTags(html);
        } else {
            console.log('Failed to fetch HTML content.');
            return null;
        }
    })
    .then(metaTags => {
        if (metaTags) {
            console.log('Meta tags:');
            metaTags.forEach(tag => {
                console.log(tag);
            });
            // Now you can use the 'metaTags' array in your code as needed.
        }
    });
