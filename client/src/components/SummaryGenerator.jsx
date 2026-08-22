function SummaryGenerator({
    uploaded,
    extractedText,
    summaryLength,
    setSummaryLength,
    generateSummary,
    isSummarizing,
    summaryError,
}) {
    if (!uploaded || !extractedText) return null;

    return (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-semibold text-gray-900">
                Generate Summary
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                Choose how detailed you want your summary to be.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
                {["short", "medium", "long"].map((length) => (
                    <button
                        key={length}
                        type="button"
                        onClick={() => setSummaryLength(length)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
                            summaryLength === length
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                        }`}
                    >
                        {length}
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={generateSummary}
                disabled={isSummarizing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSummarizing ? (
                    <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating Summary...
                    </>
                ) : (
                    "Generate Summary"
                )}
            </button>

            {summaryError && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    {summaryError}
                </div>
            )}
        </div>
    );
}

export default SummaryGenerator;
