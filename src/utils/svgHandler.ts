import { Builder, parseStringPromise } from 'xml2js';

const KETCHER_DATA_ID = 'ketcher-data';

export async function embedDataInSvg(svgContent: string, chemicalData: object): Promise<string> {
    let result: any;
    try {
        result = await parseStringPromise(svgContent);
    } catch (e) {
        // If parsing fails (e.g. empty string), create a basic SVG structure
        result = { svg: { $: { xmlns: 'http://www.w3.org/2000/svg' } } };
    }

    if (!result.svg) {
        result.svg = { $: { xmlns: 'http://www.w3.org/2000/svg' } };
    }

    // Ensure metadata tag exists
    if (!result.svg.metadata) {
        result.svg.metadata = [];
    }

    // Prepare the data entry
    const dataEntry = {
        $: { id: KETCHER_DATA_ID },
        _: JSON.stringify(chemicalData)
    };

    // Remove existing ketcher-data if present
    result.svg.metadata = result.svg.metadata.filter((m: any) => m.$?.id !== KETCHER_DATA_ID);

    // Add new data
    result.svg.metadata.push(dataEntry);

    // Ensure vital display attributes exist
    if (!result.svg.$.width) result.svg.$.width = "100%";
    if (!result.svg.$.height) result.svg.$.height = "100%";

    // Do NOT auto-generate viewBox from percentage widths as it causes blank renders if assumption fails
    // Ketcher usually provides correct viewBox. If missing, better to let browser decide than force 0 0 100 100.

    const builder = new Builder({ headless: true });
    return builder.buildObject(result);
}

export async function extractDataFromSvg(svgContent: string): Promise<object | null> {
    try {
        const result = await parseStringPromise(svgContent);
        if (!result.svg || !result.svg.metadata) {
            return null;
        }

        const metadata = result.svg.metadata.find((m: any) => m.$?.id === KETCHER_DATA_ID);
        if (metadata && metadata._) {
            return JSON.parse(metadata._);
        }
    } catch (e) {
        console.error('Error extracting data from SVG:', e);
    }
    return null;
}
