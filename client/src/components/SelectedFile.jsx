import { X } from "lucide-react";

function SelectedFile({
    file,
    getFileIcon,
    formatFileSize,
    removeFile,
}) {
    if (!file) return null;

    return (
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
    );
}

export default SelectedFile;