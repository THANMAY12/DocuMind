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
1. Create a clear summary based strictly on the text provided.
2. Identify the most important key points as bullet items.
3. Identify the main ideas of the document.
4. Provide practical, highly specific improvement suggestions tailored directly to the document content.
5. Every suggestion MUST reference specific details, terms, codes, missing context, inconsistencies, or sections found in the text.
6. AVOID generic advice such as "Improve formatting", "Add more details", or "Make the document clearer". Explain specifically WHAT should be changed and WHY based on the text.
7. Consider: missing context, unexplained terminology or identifiers, structural organization, missing supporting evidence, incomplete information, readability, and inconsistencies.
8. Do not invent facts or assume details not present in the document.
9. If the document is already well-written, provide only meaningful, high-value suggestions.

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
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2"
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