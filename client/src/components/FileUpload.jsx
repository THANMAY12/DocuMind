import { useRef, useState } from "react";
import {
    Upload,
    FileText,
    Image,
    X,
    CheckCircle,
    AlertCircle,
    File,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
];

function FileUpload() {
    const inputRef = useRef(null);
    const [extractedText, setExtractedText] = useState("");
    const [pageCount, setPageCount] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [uploadedFilename, setUploadedFilename] = useState("");
    const [summary, setSummary] = useState(null);
    const [summaryLength, setSummaryLength] = useState("medium");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    
    const selectFile = (selectedFile) => {
        setError("");
        setUploaded(false);
        setUploadedFilename("");

        if (!selectedFile) return;

        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Please upload a PDF, PNG, JPG or JPEG file.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("File size must be less than 10 MB.");
            return;
        }

        setFile(selectedFile);
    };

    const handleInputChange = (event) => {
        selectFile(event.target.files[0]);
        event.target.value = "";
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        selectFile(event.dataTransfer.files[0]);
    };

    const removeFile = () => {
        setFile(null);
        setError("");
        setUploaded(false);
        setUploadedFilename("");
        setExtractedText("");
        setPageCount(null);
        setSummary(null);
        setSummaryError("");
    };

    const uploadFile = async () => {
        if (!file) return;

        setIsUploading(true);
        setError("");
        setUploaded(false);

        try {
            const formData = new FormData();
            formData.append("document", file);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/documents/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed.");
            }

            console.log(data);

            setExtractedText(data.extraction.text);
            setPageCount(data.extraction.pages);
            if (data.file && data.file.filename) {
                setUploadedFilename(data.file.filename);
            }
            setUploaded(true);
        } catch (error) {
            console.error(error);
            setError("Unable to upload the document. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const getFileIcon = () => {
        if (!file) return <Upload size={34} />;

        if (file.type === "application/pdf") {
            return <FileText size={34} />;
        }

        return <Image size={34} />;
    };

    const formatFileSize = (size) => {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(0)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const generateSummary = async () => {
        if (!extractedText) {
            setSummaryError("There is no text available to summarize.");
            return;
        }

        setIsSummarizing(true);
        setSummaryError("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/documents/summarize`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: extractedText,
                        length: summaryLength,
                        filename: uploadedFilename,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Summary generation failed.");
            }

            setSummary(data.summary);
        } catch (error) {
            console.error("Summary error:", error);
            setSummaryError(
                "Unable to generate the summary. Please try again."
            );
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="w-full">

            {!file ? (
                <>
                    {/* Upload area*/}
                    <div
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={`group cursor-pointer rounded-3xl border-2 border-dashed p-10 transition-all sm:p-14 ${
                            isDragging
                                ? "border-gray-900 bg-gray-100"
                                : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-lg"
                        }`}
                    >
                        <div className="flex flex-col items-center text-center">

                            {/* Icon */}
                            <div
                                className={`mb-6 rounded-2xl p-5 transition ${
                                    isDragging
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-900 group-hover:text-white"
                                }`}
                            >
                                {getFileIcon()}
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                Drop your document here
                            </h2>

                            <p className="mt-2 text-sm text-gray-500 sm:text-base">
                                or click anywhere in this box to browse
                            </p>

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    inputRef.current?.click();
                                }}
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
                            >
                                <Upload size={18} />
                                Choose File
                            </button>

                            <input
                                ref={inputRef}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleInputChange}
                                className="hidden"
                            />

                            {/* Supported formats */}
                            <div className="mt-7 flex flex-wrap justify-center gap-2">
                                {["PDF", "PNG", "JPG", "JPEG"].map((type) => (
                                    <span
                                        key={type}
                                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>

                            <p className="mt-3 text-xs text-gray-400">
                                Maximum file size: 10 MB
                            </p>
                        </div>
                    </div>

                    {/* Error Message*/}
                    {error && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                </>
            ) : (


                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-4">

                            <div className="shrink-0 rounded-2xl bg-gray-100 p-4 text-gray-700">
                                {getFileIcon()}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                    {file.name}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={removeFile}
                            className="shrink-0 rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            title="Remove file"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {!uploaded && !isUploading && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                            <CheckCircle
                                size={20}
                                className="text-gray-700"
                            />

                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Document ready
                                </p>

                                <p className="text-xs text-gray-500">
                                    Your document is ready to be processed.
                                </p>
                            </div>
                        </div>
                    )}

                    {/*Upload button*/}
                    {!uploaded && (
                        <button
                            type="button"
                            onClick={uploadFile}
                            disabled={isUploading}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUploading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processing document...
                                </>
                            ) : (
                                <>
                                    <File size={18} />
                                    Process Document
                                </>
                            )}
                        </button>
                    )}

                    {/* Success */}
                    {uploaded && (
    <div className="mt-6 rounded-xl bg-gray-50 p-5">
        <div className="flex items-center gap-3">
            <CheckCircle
                size={22}
                className="text-gray-800"
            />

            <div>
                <p className="font-medium text-gray-900">
                    Document processed successfully
                </p>

                <p className="text-sm text-gray-500">
                    Your document is ready for analysis.
                </p>
            </div>
        </div>
    </div>
)}  {uploaded && extractedText && (
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
)}
{summary && (
    <div className="mt-6 space-y-6">

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">
                Summary
            </h3>

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

    </div>
)}

                    {/*Error Message*/}
                    {error && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FileUpload;