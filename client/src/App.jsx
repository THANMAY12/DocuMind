import {
    FileText,
    Sparkles,
    ShieldCheck,
} from "lucide-react";
import FileUpload from "./components/FileUpload";

function App() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">

            {/* Main content */}
            <main className="flex-1 px-4 py-10 sm:px-6 lg:py-16">
                <div className="mx-auto w-full max-w-6xl">

                    {/* Header */}
                    <header className="mx-auto mb-10 max-w-2xl text-center">

                        <div className="mb-5 flex justify-center">
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                                <Sparkles size={16} />
                                AI-powered document analysis
                            </div>
                        </div>

                        <div className="mb-5 flex justify-center">
                            <div className="rounded-2xl bg-gray-900 p-3 text-white shadow-lg">
                                <FileText size={30} />
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            DocuMind
                        </h1>

                        <p className="mt-4 text-base leading-7 text-gray-500 sm:text-lg">
                            Turn lengthy documents into clear summaries,
                            key points, and useful insights.
                        </p>
                    </header>

                    {/* Upload */}
                    <FileUpload />

                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">

                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-gray-900 p-1.5 text-white">
                            <FileText size={16} />
                        </div>

                        <span className="text-sm font-semibold text-gray-800">
                            DocuMind
                        </span>
                    </div>

                    <div className="flex items-center gap-5 text-sm text-gray-500">

                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            <span>Secure document processing</span>
                        </div>

                        <a
    href="https://github.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="transition hover:text-gray-900"
>
    GitHub
</a>

                    </div>

                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} DocuMind
                    </p>

                </div>
            </footer>

        </div>
    );
}

export default App;