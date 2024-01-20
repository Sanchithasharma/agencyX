const fetch = require('isomorphic-fetch');
const { JSDOM } = require('jsdom');

async function getHtml(url: string): Promise<string | null> {
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

async function getTags(html: string): Promise<Array<{ [key: string]: string }> | null> {
    try {
        // Create a DOM from the HTML string using jsdom
        const dom = new JSDOM(html);
        const doc = dom.window.document;


        // Query the document for all meta tags
        const metaTags = doc.querySelectorAll('meta');

        // Create an array to store the meta tag attributes
        const metaTagAttributes: Array<{ [key: string]: string }> = [];

        // Loop through each meta tag and extract attributes
        metaTags.forEach((tag: Element) => {
            const attributes: { [key: string]: string } = {};
            tag.getAttributeNames().forEach((attributeName: string) => {
                attributes[attributeName] = tag.getAttribute(attributeName) || '';
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
        }
    });