import { FileText } from "lucide-react";

function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl">

                {/* Header */}
                <div className="text-center mb-10">

                    <div className="flex justify-center mb-4">
                        <div className="bg-black text-white p-3 rounded-xl">
                            <FileText size={32} />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900">
                        DocuMind
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Turn documents into clear, actionable insights.
                    </p>

                </div>

                {/* Upload Area */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">

                    <FileText
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                    />

                    <h2 className="text-xl font-semibold text-gray-800">
                        Upload your document
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Drag and drop a PDF or image here
                    </p>

                    <button className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                        Choose File
                    </button>

                    <p className="text-xs text-gray-400 mt-4">
                        Supported formats: PDF, PNG, JPG, JPEG
                    </p>

                </div>

            </div>
        </div>
    );
}

export default App;