const fs = require("fs");
const { PNG } = require("pngjs");

// Helper to convert PDF image stream to PNG buffer
function imageToPngBuffer(img) {
    const { width, height, data } = img;
    if (!data || !width || !height) return null;

    const png = new PNG({ width, height });

    if (data.length === width * height * 4) {
        png.data = Buffer.from(data);
    } else if (data.length === width * height * 3) {
        for (let src = 0, dest = 0; src < data.length; src += 3, dest += 4) {
            png.data[dest] = data[src];
            png.data[dest + 1] = data[src + 1];
            png.data[dest + 2] = data[src + 2];
            png.data[dest + 3] = 255;
        }
    } else if (data.length === width * height) {
        for (let src = 0, dest = 0; src < data.length; src++, dest += 4) {
            const val = data[src];
            png.data[dest] = val;
            png.data[dest + 1] = val;
            png.data[dest + 2] = val;
            png.data[dest + 3] = 255;
        }
    } else {
        return null;
    }

    return PNG.sync.write(png);
}

function fetchImageObject(page, imgName) {
    return new Promise((resolve) => {
        try {
            if (page.objs.has(imgName)) {
                page.objs.get(imgName, (img) => resolve(img));
            } else if (page.commonObjs && page.commonObjs.has(imgName)) {
                page.commonObjs.get(imgName, (img) => resolve(img));
            } else {
                resolve(null);
            }
        } catch (e) {
            resolve(null);
        }
    });
}

async function extractScannedPdfOcr(filePath, extractImageText) {
    if (globalThis.pdfjsWorker) delete globalThis.pdfjsWorker;

    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const data = new Uint8Array(fs.readFileSync(filePath));

    const loadingTask = pdfjs.getDocument({
        data,
        disableWorker: true,
        useSystemFonts: true,
        disableFontFace: true,
    });

    const doc = await loadingTask.promise;
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const ops = await page.getOperatorList();
        let pageText = "";

        for (let i = 0; i < ops.fnArray.length; i++) {
            const fn = ops.fnArray[i];
            const isImage =
                fn === pdfjs.OPS.paintImageXObject ||
                fn === pdfjs.OPS.paintJpegXObject ||
                fn === pdfjs.OPS.paintImageMaskXObject;

            if (isImage) {
                const imgName = ops.argsArray[i][0];
                const img = await fetchImageObject(page, imgName);

                if (img) {
                    const pngBuffer = imageToPngBuffer(img);
                    if (pngBuffer) {
                        const ocrResult = await extractImageText(pngBuffer);
                        if (ocrResult) {
                            pageText += (pageText ? "\n" : "") + ocrResult;
                        }
                    }
                }
            }
        }

        if (pageText) {
            pageTexts.push(pageText);
        }
    }

    return {
        text: pageTexts.join("\n\n").trim(),
        pages: doc.numPages,
    };
}

module.exports = extractScannedPdfOcr;
