import { useRef, useState } from "react";
import { Upload, FileText, Image, AlertCircle, CheckCircle, File } from "lucide-react";
import UploadDropzone from "./UploadDropzone";
import SelectedFile from "./SelectedFile";
import SummaryGenerator from "./SummaryGenerator";
import SummaryResult from "./SummaryResult";
import { API_URL } from "../config/api";

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
    const [extractionMeta, setExtractionMeta] = useState(null);
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
        setExtractionMeta(null);

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
        setExtractionMeta(null);
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

            const response = await fetch(`${API_URL}/api/documents/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed.");
            }

            setExtractedText(data.extraction.text);
            setPageCount(data.extraction.pages);
            if (data.extraction) {
                setExtractionMeta({
                    pages: data.extraction.pages,
                    characterCount: data.extraction.characterCount,
                    method: data.extraction.method,
                });
            }
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
        if (file.type === "application/pdf") return <FileText size={34} />;
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
            const response = await fetch(`${API_URL}/api/documents/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: extractedText,
                    length: summaryLength,
                    filename: uploadedFilename,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Summary generation failed.");
            }

            setSummary(data.summary);
        } catch (error) {
            console.error("Summary error:", error);
            setSummaryError("Unable to generate the summary. Please try again.");
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="w-full">
            {!file ? (
                <UploadDropzone
                    inputRef={inputRef}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    handleDrop={handleDrop}
                    handleInputChange={handleInputChange}
                    getFileIcon={getFileIcon}
                    error={error}
                />
            ) : (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <SelectedFile
                        file={file}
                        getFileIcon={getFileIcon}
                        formatFileSize={formatFileSize}
                        removeFile={removeFile}
                    />

                    {!uploaded && !isUploading && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                            <CheckCircle size={20} className="text-gray-700" />
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

                    {uploaded && extractionMeta && (
                        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm">
                                        <CheckCircle size={20} className="text-gray-900" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 sm:text-base">
                                            Document processed successfully
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                                            {file.type === "application/pdf"
                                                ? (extractionMeta.method === "ocr" ? "Scanned PDF" : "PDF")
                                                : "Image"}
                                            {extractionMeta.pages ? ` • ${extractionMeta.pages} ${extractionMeta.pages === 1 ? "page" : "pages"}` : ""}
                                            {typeof extractionMeta.characterCount === "number"
                                                ? ` • ${extractionMeta.characterCount.toLocaleString()} characters`
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="self-start sm:self-center">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                                        <span className="h-2 w-2 rounded-full bg-gray-900" />
                                        Extraction: {extractionMeta.method === "pdf" ? "PDF text" : "OCR"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <SummaryGenerator
                        uploaded={uploaded}
                        extractedText={extractedText}
                        summaryLength={summaryLength}
                        setSummaryLength={setSummaryLength}
                        generateSummary={generateSummary}
                        isSummarizing={isSummarizing}
                        summaryError={summaryError}
                    />

                    <SummaryResult summary={summary} />

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