const { normalizeSkillName } = require("../../src/utils/skillNormailizer");

describe("skillNormalizer Function Test", () => {
    test("should normalize skills correctly", () => {
        const input = [
            { name: "JavaScript" },
            { name: "PYTHON" },
            { name: "react" },
            { name: "Node.Js" },
            { name: "html/css" },
            { name: "Django" },
            { name: "C++" },
            { name: "GO" }
        ];
        const expectedOutput = [
            { name: "JavaScript" },
            { name: "Python" },
            { name: "React" },
            { name: "Node.js" },
            { name: "HTML/CSS" },
            { name: "Django" },
            { name: "C++" },
            { name: "Go" }
        ];
        const result = normalizeSkillName(input);
        expect(result).toEqual(expectedOutput);
    });

    test("should handle empty array", () => {
        const input = [];
        const expectedOutput = [];
        const result = normalizeSkillName(input);
        expect(result).toEqual(expectedOutput);
    });

    test("should handle skills with extra spaces and mixed cases", () => {
        const input = [
            { name: "  JavaScript  " },
            { name: " PYTHON" },
            { name: "react " },
            { name: " Node.Js " },
            { name: " html/css " },
            { name: " Django " },
            { name: " C++ " },
            { name: " GO " }
        ];
          const expectedOutput = [
            { name: "JavaScript" },
            { name: "Python" },
            { name: "React" },
            { name: "Node.js" },
            { name: "HTML/CSS" },
            { name: "Django" },
            { name: "C++" },
            { name: "Go" }
        ];
        const result = normalizeSkillName(input);
        expect(result).toEqual(expectedOutput);
    });

    test("should handle skills with special characters", () => {
        const input = [
            { name: "C#" },
            { name: "F#" },
            { name: "C++" },
            { name: "Node.js" },
            { name: "HTML/CSS" }
        ];
        const expectedOutput = [
            { name: "C#" },
            { name: "F#" },
            { name: "C++" },
            { name: "Node.js" },
            { name: "HTML/CSS" }
        ];
        const result = normalizeSkillName(input);
        expect(result).toEqual(expectedOutput);
    });

    test("should handle skills with numbers", () => {
        const input = [
            { name: "Python3" },
            { name: "Node.js14" },
            { name: "C++11" }
        ];
        const expectedOutput = [
            { name: "Python" },
            { name: "Node.js" },
            { name: "C++" }
        ];
        const result = normalizeSkillName(input);
        expect(result).toEqual(expectedOutput);
    });

    test("should handle skills that are already normalized", () => {
        const input = [
            { name: "javascript" },
            { name: "python" },
            { name: "react" }
        ];
        const expectedOutput = [
            { name: "JavaScript" },
            { name: "Python" },
            { name: "React" }
        ];
        const result = normalizeSkillName(input);
        expect(result).toEqual(expectedOutput);
    });

    test("should handle skills with underscores and hyphens", () => {
        const input = [
            { name: "C_Sharp" },
            { name: "F-Sharp" },
            { name: "Node_js" },
            { name: "HTML-CSS" }
        ];
        const expectedOutput = [
            { name: "C#" },
            { name: "F#" },
            { name: "Node.js" },
            { name: "HTML/CSS" }
        ];
        const result = normalizeSkillName(input);
        expect(result).toEqual(expectedOutput);
    });
});
