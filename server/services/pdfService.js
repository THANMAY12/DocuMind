const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractPdfText = async (filePath) => {
    const file = fs.readFileSync(filePath);

    const parser = new PDFParse({
        data: file,
    });

    const result = await parser.getText();

    await parser.destroy();

    return {
        text: result.text.trim(),
        pages: result.total,
    };
};

module.exports = extractPdfText;