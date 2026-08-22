const express = require("express");
const multer = require("multer");

const extractPdfText = require("../services/pdfService");

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
        }

        res.json({
            success: true,
            message: "Document processed successfully.",
            file: {
                name: req.file.originalname,
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

module.exports = router;