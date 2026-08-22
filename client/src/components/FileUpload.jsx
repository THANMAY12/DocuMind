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

    const selectFile = (selectedFile) => {
        setError("");
        setUploaded(false);

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
        setExtractedText("");
        setPageCount(null);
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
                `${import.meta.env.VITE_API_URL}/api/documents/upload`,
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
                                        Document uploaded successfully
                                    </p>
                                    {uploaded && extractedText && (
                                        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        Extracted Text
                                                    </h3>

                                                    {pageCount && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {pageCount} pages
                                                        </p>
                                                    )}
                                                </div>

                                                <span className="text-xs text-gray-400">
                                                    {extractedText.length.toLocaleString()} characters
                                                </span>
                                            </div>

                                            <div className="max-h-80 overflow-y-auto rounded-xl bg-white p-4 text-sm leading-6 text-gray-600">
                                                {extractedText}
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-sm text-gray-500">
                                        Your document is ready for analysis.
                                    </p>
                                </div>
                            </div>
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