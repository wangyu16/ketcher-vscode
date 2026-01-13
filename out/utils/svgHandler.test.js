"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgHandler_1 = require("./svgHandler");
describe('SVG Handler', () => {
    const mockData = { molecule: 'C=C' };
    const basicSvg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M10 10"/></svg>';
    it('should embed data into an SVG', async () => {
        const result = await (0, svgHandler_1.embedDataInSvg)(basicSvg, mockData);
        expect(result).toContain('ketcher-data');
        expect(result).toContain(JSON.stringify(mockData));
    });
    it('should extract data from an SVG', async () => {
        const result = await (0, svgHandler_1.embedDataInSvg)(basicSvg, mockData);
        const extracted = await (0, svgHandler_1.extractDataFromSvg)(result);
        expect(extracted).toEqual(mockData);
    });
    it('should handle extracting from SVG without data', async () => {
        const extracted = await (0, svgHandler_1.extractDataFromSvg)(basicSvg);
        expect(extracted).toBeNull();
    });
    it('should handle invalid SVG gracefully', async () => {
        const extracted = await (0, svgHandler_1.extractDataFromSvg)('invalid svg');
        expect(extracted).toBeNull();
    });
    it('should update existing data', async () => {
        const first = await (0, svgHandler_1.embedDataInSvg)(basicSvg, { foo: 'bar' });
        const second = await (0, svgHandler_1.embedDataInSvg)(first, mockData);
        const extracted = await (0, svgHandler_1.extractDataFromSvg)(second);
        expect(extracted).toEqual(mockData);
    });
});
//# sourceMappingURL=svgHandler.test.js.map