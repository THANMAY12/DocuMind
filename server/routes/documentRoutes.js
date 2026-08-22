const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const extractImageText = require("../services/ocrService");
const extractPdfText = require("../services/pdfService");
const generateSummary = require("../services/summaryService");
const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, PNG and JPG files are allowed."));
        }
    },
});

// Upload route 
router.post("/upload", upload.single("document"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a document.",
            });
        }

        let text = "";
        let pages = null;

        if (req.file.mimetype === "application/pdf") {
            const result = await extractPdfText(req.file.path);
            text = result.text;
            pages = result.pages;
        } else {
            text = await extractImageText(req.file.path);
        }

        res.json({
            success: true,
            message: "Document processed successfully.",
            file: {
                name: req.file.originalname,
                filename: req.file.filename,
                type: req.file.mimetype,
                size: req.file.size,
            },
            extraction: {
                text,
                pages,
                characterCount: text.length,
            },
        });
    } catch (error) {
        console.error("Document upload error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to process the document.",
        });
    }
});

// Ai summary 
router.post("/summarize", async (req, res) => {
    try {
        const { text, length, filename } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "No document text was provided.",
            });
        }

        const MAX_TEXT_LENGTH = 50000;
        const documentText = text.slice(0, MAX_TEXT_LENGTH);

        const summary = await generateSummary(
            documentText,
            length
        );

        // Delete temporary upload file after successful summarization
        if (filename) {
            const safeFilename = path.basename(filename);
            const filePath = path.join(__dirname, "../uploads", safeFilename);
            fs.unlink(filePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.error("Failed to delete temp file:", err.message);
                }
            });
        }

        res.json({
            success: true,
            summary,
        });
    } catch (error) {
        console.error("Summary generation error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to generate summary.",
        });
    }
});


module.exports = router;