const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const extractImageText = require("./ocrService");
const extractScannedPdfOcr = require("./pdfOcrFallback");

const MIN_TEXT_LENGTH = 50;

const extractPdfText = async (filePath) => {
    const file = fs.readFileSync(filePath);

    // Try normal PDF text extraction first
    const parser = new PDFParse({ data: file });
    const pdfResult = await parser.getText();
    await parser.destroy();

    const text = (pdfResult.text || "").trim();
    const pages = pdfResult.total || 1;
    const charCount = text.replace(/\s+/g, "").length;

    // Return text PDF result if it has enough content
    if (charCount >= MIN_TEXT_LENGTH) {
        return {
            text,
            pages,
            method: "pdf",
        };
    }

    // Fall back to OCR for scanned or image-heavy PDFs
    try {
        const ocrResult = await extractScannedPdfOcr(filePath, extractImageText);
        return {
            text: ocrResult?.text || text,
            pages: ocrResult?.pages || pages,
            method: "ocr",
        };
    } catch (error) {
        console.error("PDF OCR fallback error:", error.message);
    }

    return {
        text,
        pages,
        method: "pdf",
    };
};

module.exports = extractPdfText;