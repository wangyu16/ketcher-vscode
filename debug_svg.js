"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgHandler_1 = require("./src/utils/svgHandler");
const mockKet = { root: 'test-data' };
const mockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect x="10" y="10" width="30" height="30"/></svg>`;
async function test() {
    console.log('--- Original SVG ---');
    console.log(mockSvg);
    console.log('--- Embedding Data ---');
    const embedded = await (0, svgHandler_1.embedDataInSvg)(mockSvg, mockKet);
    console.log(embedded);
    console.log('--- Extracting Data ---');
    const extracted = await (0, svgHandler_1.extractDataFromSvg)(embedded);
    console.log('Extracted:', JSON.stringify(extracted));
}
test();
//# sourceMappingURL=debug_svg.js.map