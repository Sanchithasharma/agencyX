"use server";
import { MetaTags } from "@/types";
import { openai } from "@/lib/openai";

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

async function getTextContent(html: string): Promise<string> {
    try {
        // Create a DOM from the HTML string using jsdom
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // Query the document for the main content
        const textContent = doc.querySelector("main").textContent;

        // Replace consecutive spaces and newline characters with a single space
        const trimmedContent = textContent.replace(/\s+/g, ' ');

        return trimmedContent;
    } catch (error) {
        console.error("Error parsing HTML:", error);
        return "";
    }
}

async function getDescriptionFromChatGPT(textContent: string): Promise<string | null> {
    const example1_textContent = 'Home Designs Exclusively Designed With You In Mind With over 40 years experience designing and building award-winning, sustainable homes, we have a proud heritage in delivering quality, style and functionality. We create home designs unique to your personality, lifestyle and budget requirements through a consultative design and building process. Each design is completely tailored, because as designers and creators, we believe every home we create should be uniquely yours.Offering a comprehensive building design service, our in-house design team provides services customised to your project. This includes everything from concept design to colour selection, to 3D visualisations and detailed design documentation.When you choose Anstey Homes for your design and construction needs, our skilled designers, who possess extensive building expertise, will make sure to integrate intelligent design elements that minimise construction expenses, address sound-related concerns, optimise environmental advantages, and guarantee excellent structural integrity.This truly is building…by Design. View Our Showcase Of Designs Below Anstey Homes Introduction An introduction to Anstey Homes custom designs See Brochure Download Brochure Grand Designs Luxe living! Ultra-modern homes, epitomising beauty and grandeur See Brochure Download Brochure Granny Flats Elegant, functional and desirable granny flats See Brochure Download Brochure Small Sites Designs that don’t sacrifice style for size See Brochure Download Brochure Micro Tiny Homes Cost-effective homes that meet the requirements of the Building Code of Australia See Brochure Download Brochure One-Storey Homes A selection of our stylish, single storey homes See Brochure Download Brochure Rural Homes Rural site designs that offer an idyllic lifestyle See Brochure Download Brochure Beach Homes The beachside home youve been dreaming of is within reach See Brochure Download Brochure Dual Living Homes Cleverly designed homes for multi-generational living or an additional rental income See Brochure Download Brochure Homes For Narrow Lots Uniquely designed homes for narrow lots that optimse the use of available space See Brochure Download Brochure Two-Storey Homes Two-storey homes that are built to meet your unique lifestyle requirements See Brochure Download Brochure Elevated Homes We are specialists in elevated homes for flood prone zones See Brochure Download Brochure Farm Houses Beautiful farm houses to take advantage of the country lifestyle See Brochure Download Brochure Sloping-Down Site Homes Creative solutions for sites that slope downwards from the street See Brochure Download Brochure Sloping-Up Site Homes Creative solutions for sites that slope upwards from the street See Brochure Download Brochure Duplex Homes Luxury duplexes that present a perfect solution in sought-after suburbs See Brochure Download Brochure Ready To Experience The Anstey Homes Design And Build Difference? Let’s collaborate and create your unique, dream home at an affordable price. Click the button below for an obligation-free chat with our friendly team today.'
    const example1_returnedTags = '<meta name="description" content="Explore our exquisite home designs, crafted for your unique lifestyle. Discover the perfect blend of beauty and functionality."/>'
    const example2_textContent = 'Wills & Estates Secure the future of your loved ones with our expertise Contact us At JMR Lawyers and Mediators, we understand that planning for the future is an essential part of protecting your family and assets. Our experienced legal team is here to guide you through the intricate process of creating or updating your Will and establishing your Power of Attorney. Compassionate guidance for your legacy Your family, friends, and cherished causes are close to your heart, and ensuring their wellbeing is a priority. That’s why we emphasise the importance of preparing a legally sound Will and strongly advise against using DIY Will Kits. A professionally crafted Will is essential to ensure your loved ones are cared for, and your last wishes are honoured. The Power of Attorney Your Power of Attorney is important, as this is a trusted individual(s) to act on your behalf when needed. This can encompass managing your finances, making crucial healthcare decisions, or representing you during your absence.Life is unpredictable, and we urge you not to delay establishing or revising your Will and Powers of Attorney. Regular reviews of these documents ensure they remain aligned with your current needs and wishes. Estate matters Losing a loved one is an emotionally challenging experience, and dealing with their estate can place additional pressure on you. At JMR Lawyers and Mediators, we provide compassionate assistance during this challenging period. Whether you need to transfer property ownership, apply for a grant of probate from the Supreme Court, or require guidance as an Executor, we have the expertise to support you.Our reduced-rate consultations are designed to alleviate stress and pressure during this emotional time. Please don’t hesitate to contact our office to discuss our competitive prices and schedule an initial consultation for advice and guidance. The support you need from mediation to the courtroom You’ll feel supported by your lawyer from the initial consultation, through any mediation processes undertaken, and through to the courtroom if your matter progresses. We’re here for you at every stage of the process. It’s our goal to ensure you have the support you need to navigate this process with confidence. Our efficient and affordable services At JMR Lawyers and Mediators, we offer competitive pricing for crafting Wills and Enduring Powers of Attorney. In most cases, we can draft these documents on the same day. For clients over 60 years of age, we request a Letter of Capacity from your treating medical practitioner to confirm your ability to enter into a Will or Enduring Power of Attorney – this is to ensure that if your Will is contested after your passing, that we can provide evidence of your capacity at the time of making your Will. Why choose us? Save time & money Planning for your future through Wills and Estates is an investment, and we understand the value of your time and resources. At JMR Lawyers and Mediators, we can help you save both time and money by ensuring your legal matters are handled efficiently and effectively from the start. Transparent fees & advice We believe in full transparency when it comes to our fees. We set transparent fees for each stage of the process, providing you with a comprehensive understanding of what to expect as we progress. Our dedicated team ensures you have a complete picture of the costs involved, giving you peace of mind throughout the journey. We work around your life Your life shouldn’t come to a standstill because of legal matters. We respect your commitments and offer flexibility in our service. Our consultations are available online, over the phone, and after hours to accommodate your schedule, ensuring you can prioritise your personal life and legal needs. Service personalised to your needs At JMR Lawyers and Mediators, we tailor our services to align with your unique requirements. It all begins with a deep understanding of you and your needs. This personalised approach shines through in our processes as we work diligently to meet those needs, ensuring your experience is both comprehensive and customised to your circumstances. We’re here for you. We understand how taxing legal matters can be. With a team of compassionate lawyers ready to fight for you and your family, we’re here for you.'
    const example2_returnedTags = '<meta name="description" content="Planning for the future is essential for protecting your family and assets. Get help with creating or updating a Will and establishing Power of Attorney."/>'
    const example3_textContent = 'Essense of Australia Lennon Price Range $2500-$3000 make a booking Default Title Description Description Luxe stretch crepe hugs every curve in Lennon by Essense of Australia, a contemporary column wedding dress that features exquisite draping. From off-the-shoulder straps, a draped V-neckline accentuates the bust as lustrous crepe wraps around the waist to highlight a natural hourglass figure. All the draping comes to a striking symmetrical back detail with a row of timeless fabric-covered buttons that extend to the end of the sweeping train. Sleek seams and impeccable construction create a memorable wedding dress fit for the fashion-forward bride. Read more DRESS DETAILS DRESS DETAILS Colours Ivory Fabric Crepe Neckline Off the Shoulder , V-Neck Silhouette Fit and Flare , Mermaid {"id":8828056830274,"title":"Lennon","handle":"lennon","description":"\u003cdiv data-mce-fragment=\"1\"\u003e\n\u003cspan data-mce-fragment=\"1\"\u003eLuxe stretch crepe hugs every curve in Lennon by Essense of Australia, a contemporary column wedding dress that features exquisite draping. From off-the-shoulder straps, a draped V-neckline accentuates the bust as lustrous crepe wraps around the waist to highlight a natural hourglass figure. All the draping comes to a striking symmetrical back detail with a row of timeless fabric-covered buttons that extend to the end of the sweeping train. Sleek seams and impeccable construction create a memorable wedding dress fit for the fashion-forward bride.'
    const example3_returnedTags = '<meta name="description" content="Luxe stretch crepe hugs every curve in Lennon by Essense of Australia, a contemporary column wedding dress that features exquisite draping."/>'
    const response = await openai.chat.completions.create({
        messages: [
            {
                "role": "system",
                "content": "You are a helpful assistant who will be provided with a block of text, and your task is to use that text to create meta tags for SEO purposes. THE MAXIMUM NUMBER OF CHARACTERS FOR EACH META TAG IS 150 CHARACTERS."
            },
            {
                "role": "user",
                "content": `Here is an example of text content: ${example1_textContent}`
            },
            {
                "role": "assistant",
                "content": example1_returnedTags
            },
            {
                "role": "user",
                "content": `Here is an example of text content: ${example2_textContent}`
            },
            {
                "role": "assistant",
                "content": example2_returnedTags
            },
            {
                "role": "user",
                "content": `Here is an example of text content: ${example3_textContent}`
            },
            {
                "role": "assistant",
                "content": example3_returnedTags
            },
            {
                "role": "user",
                "content": `Here is an example of text content: ${textContent}`
            }
        ],
        model: "gpt-3.5-turbo",
    });

    // console.log("ChatGPT Response", response);
    return response.choices[0].message.content
}

export { getTags, getHtml, getTextContent, getDescriptionFromChatGPT };
