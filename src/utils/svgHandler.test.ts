import { embedDataInSvg, extractDataFromSvg } from './svgHandler';

describe('SVG Handler', () => {
    const mockData = { molecule: 'C=C' };
    const basicSvg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M10 10"/></svg>';

    it('should embed data into an SVG', async () => {
        const result = await embedDataInSvg(basicSvg, mockData);
        expect(result).toContain('ketcher-data');
        expect(result).toContain(JSON.stringify(mockData));
    });

    it('should extract data from an SVG', async () => {
        const result = await embedDataInSvg(basicSvg, mockData);
        const extracted = await extractDataFromSvg(result);
        expect(extracted).toEqual(mockData);
    });

    it('should handle extracting from SVG without data', async () => {
        const extracted = await extractDataFromSvg(basicSvg);
        expect(extracted).toBeNull();
    });

    it('should handle invalid SVG gracefully', async () => {
        const extracted = await extractDataFromSvg('invalid svg');
        expect(extracted).toBeNull();
    });

    it('should update existing data', async () => {
        const first = await embedDataInSvg(basicSvg, { foo: 'bar' });
        const second = await embedDataInSvg(first, mockData);
        const extracted = await extractDataFromSvg(second);
        expect(extracted).toEqual(mockData);
    });
});
