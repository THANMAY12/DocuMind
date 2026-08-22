import { Upload, AlertCircle } from "lucide-react";

function UploadDropzone({
    inputRef,
    isDragging,
    setIsDragging,
    handleDrop,
    handleInputChange,
    getFileIcon,
    error,
}) {
    return (
        <>
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

            {error && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}
        </>
    );
}

export default UploadDropzone;
