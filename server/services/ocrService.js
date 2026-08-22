const { createWorker} =require("tesseract.js");

const extractImageText=async(filePath) => {
    const worker= await createWorker("eng");
    const result = await worker.recognize(filePath);
    await worker.terminate();
    return result.data.text.trim();
};
module.exports = extractImageText;