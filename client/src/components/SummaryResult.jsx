import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

function SummaryResult({ summary }) {
    const [copied, setCopied] = useState(false);

    if (!summary) return null;

    const copySummary = async () => {
        if (!summary.summary) return;
        try {
            await navigator.clipboard.writeText(summary.summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const downloadSummary = () => {
        if (!summary.summary) return;
        let content = `DOCUMIND SUMMARY\n${"=".repeat(30)}\n\n`;
        content += `${summary.summary}\n\n`;

        if (Array.isArray(summary.keyPoints) && summary.keyPoints.length > 0) {
            content += `KEY POINTS:\n`;
            summary.keyPoints.forEach((point) => {
                content += `- ${point}\n`;
            });
            content += `\n`;
        }

        if (Array.isArray(summary.mainIdeas) && summary.mainIdeas.length > 0) {
            content += `MAIN IDEAS:\n`;
            summary.mainIdeas.forEach((idea) => {
                content += `- ${idea}\n`;
            });
            content += `\n`;
        }

        if (Array.isArray(summary.suggestions) && summary.suggestions.length > 0) {
            content += `IMPROVEMENT SUGGESTIONS:\n`;
            summary.suggestions.forEach((suggestion) => {
                content += `- ${suggestion}\n`;
            });
        }

        const element = document.createElement("a");
        const file = new Blob([content], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "DocuMind_Summary.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Summary
                    </h3>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={copySummary}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                            title="Copy summary text"
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="text-green-600" />
                                    <span className="text-green-600">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={downloadSummary}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                            title="Download summary as TXT"
                        >
                            <Download size={14} />
                            <span>Download</span>
                        </button>
                    </div>
                </div>

                <p className="mt-4 leading-7 text-gray-600">
                    {summary.summary}
                </p>
            </div>

            {Array.isArray(summary.keyPoints) && summary.keyPoints.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Key Points
                    </h3>

                    <ul className="mt-4 space-y-3">
                        {summary.keyPoints.map((point, index) => (
                            <li
                                key={index}
                                className="flex gap-3 text-gray-600"
                            >
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {Array.isArray(summary.mainIdeas) && summary.mainIdeas.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Main Ideas
                    </h3>

                    <ul className="mt-4 space-y-3">
                        {summary.mainIdeas.map((idea, index) => (
                            <li
                                key={index}
                                className="flex gap-3 text-gray-600"
                            >
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gray-900" />
                                <span>{idea}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {Array.isArray(summary.suggestions) && summary.suggestions.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Improvement Suggestions
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Practical suggestions based on the document content.
                    </p>

                    <ul className="mt-5 space-y-3">
                        {summary.suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SummaryResult;
