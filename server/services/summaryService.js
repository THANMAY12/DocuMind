const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateSummary = async (text, length = "medium") => {
    const lengthInstructions = {
        short: "Give a brief summary in 3 to 5 sentences.",
        medium: "Give a clear summary in 1 to 2 paragraphs.",
        long: "Give a detailed summary covering the important information and ideas.",
    };

    const instruction =
        lengthInstructions[length] || lengthInstructions.medium;

    const prompt = `
You are DocuMind, an intelligent document summarization assistant.

Analyze the document below.

${instruction}

Instructions:
1. Create a clear summary.
2. Identify the most important key points.
3. Identify the main ideas.
4. Provide practical, specific suggestions for improving the document.
5. When evaluating suggestions, consider clarity, organization, completeness, missing information, readability, supporting evidence, and actionable improvements.
6. Do not invent facts that are not present in the document.
7. If the document is already well-written, provide only meaningful improvements.

Return ONLY valid JSON in this exact structure:

{
  "summary": "The document summary",
  "keyPoints": [
    "Important point 1",
    "Important point 2",
    "Important point 3"
  ],
  "mainIdeas": [
    "Main idea 1",
    "Main idea 2"
  ],
  "suggestions": [
    "Improvement suggestion 1",
    "Improvement suggestion 2",
    "Improvement suggestion 3"
  ]
}

Do not include markdown.
Do not include code fences.
Do not add any text outside the JSON.

Document:
${text}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    const result = response.text || "";
    const cleanResult = result.replace(/```json/gi, "").replace(/```/g, "").trim();

    return JSON.parse(cleanResult);
};

module.exports = generateSummary;