# DocuMind – Document Summary Assistant

DocuMind is a web application that accepts PDF documents and image files (PNG, JPG, JPEG), extracts their text using PDF parsing or optical character recognition (OCR), and generates structured summaries, key points, main ideas, and improvement suggestions using Google Gemini AI.

---

## Assessment Approach

DocuMind was designed as a lightweight full-stack document analysis application with a clear separation between the frontend, backend, and AI processing layers. The React frontend provides a responsive drag-and-drop/file-picker interface and lets users choose the desired summary length. The Express backend handles file uploads and determines the appropriate extraction method based on the document type. Digital PDFs are processed using `pdf-parse`, while images and scanned documents are processed using `Tesseract.js` OCR.

The extracted text is sent to the backend summarization service, which uses the Google Gemini API to generate a structured response containing a summary, key points, main ideas, and document-specific improvement suggestions. The application also provides loading and error states, copy/download functionality, and responsive result components.

Uploaded documents are treated as temporary data. Files remain available during processing and are deleted from server storage after successful summarization. If AI processing fails, the file is retained temporarily to allow retrying.

The implementation focuses on clean component separation, simple error handling, environment-based configuration, and a minimal architecture suitable for deployment and future extension.

---

## Features

- **PDF Upload**: Extract text directly from digital PDF files.
- **Image Upload (OCR)**: Extract text from JPG, JPEG, and PNG images using Tesseract OCR.
- **Flexible File Input**: Supports both drag-and-drop and native file picker upload.
- **Summary Length Control**: Select between Short (3–5 sentences), Medium (1–2 paragraphs), or Long (detailed) summary depths.
- **Structured AI Insights**:
  - **Summary**: Concise overview of the document content.
  - **Key Points**: Bulleted list of critical statements and facts.
  - **Main Ideas**: Core concepts highlighted across the document.
  - **Improvement Suggestions**: Actionable feedback regarding organization, clarity, completeness, and supporting evidence.
- **Utility Actions**: Copy summary text to clipboard or download the full analysis as a `.txt` file.
- **Automatic File Cleanup**: Uploaded files are stored temporarily during processing and automatically deleted from the server upon successful summarization.
- **State & Error Feedback**: Visual loaders, drag states, validation errors, and retry options.
- **Responsive UI**: Modern, responsive layout designed for desktop and mobile viewports.

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express
- **File Uploads**: Multer
- **PDF Extraction**: `pdf-parse`
- **OCR Engine**: Tesseract.js

### AI Service
- **LLM API**: Google Gemini API (`@google/genai`)

---

## Architecture Overview

```text
[ User ]
   │
   ▼
[ React Frontend ] (File Upload / Length Controls / Results UI)
   │
   ├── POST /api/documents/upload (multipart/form-data)
   ▼
[ Express API ]
   │
   ├── PDF File  ──► [ pdf-parse ]   ──┐
   └── Image File ──► [ Tesseract.js ] ──┼──► Extracted Text & Stored Filename
                                        │
   ┌────────────────────────────────────┘
   │
   ├── POST /api/documents/summarize (JSON)
   ▼
[ Gemini AI ] ──► Structured JSON Response
   │
   ▼
[ Server Disk ] ──► Auto-delete temporary file from server/uploads/
```

---

## Project Structure

```text
DocuMind/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx         # Main orchestrator component
│   │   │   ├── UploadDropzone.jsx     # Drag-and-drop & file selector
│   │   │   ├── SelectedFile.jsx       # File preview & removal control
│   │   │   ├── SummaryGenerator.jsx   # Length selector & summary trigger
│   │   │   └── SummaryResult.jsx      # Summary cards, copy & download
│   │   ├── config/
│   │   │   └── api.js                 # API URL base configuration
│   │   ├── App.jsx                    # Root app layout
│   │   ├── index.css                  # Tailwind styles
│   │   └── main.jsx                   # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── routes/
│   │   └── documentRoutes.js          # Upload & summarize API endpoints
│   ├── services/
│   │   ├── ocrService.js              # Tesseract OCR handler
│   │   ├── pdfService.js              # pdf-parse handler
│   │   └── summaryService.js          # Gemini AI integration
│   ├── uploads/                       # Temporary document storage
│   ├── server.js                      # Express server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Clone Repository & Install Dependencies

#### Client Setup
```bash
cd client
npm install
```

#### Server Setup
```bash
cd ../server
npm install
```

---

## Environment Variables

### Client (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

### Server (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: Actual `.env` files containing sensitive API keys should never be committed to source control. Ensure `.env` is listed in your `.gitignore`.

---

## Running Locally

1. **Start the Backend Server**:
   ```bash
   cd server
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

2. **Start the Frontend Application**:
   Open a new terminal window:
   ```bash
   cd client
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## API Endpoints

### `POST /api/documents/upload`
- **Description**: Accepts a single file (`document`) via `multipart/form-data`.
- **Supported File Types**: `.pdf`, `.png`, `.jpg`, `.jpeg` (Max 10 MB).
- **Processing**: Extracts text via `pdf-parse` for PDFs or `Tesseract.js` for images.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Document processed successfully.",
    "file": {
      "name": "sample.pdf",
      "filename": "1740000000-sample.pdf",
      "type": "application/pdf",
      "size": 128714
    },
    "extraction": {
      "text": "Extracted text content...",
      "pages": 2,
      "characterCount": 1250
    }
  }
  ```

### `POST /api/documents/summarize`
- **Description**: Accepts document text, length preference (`short`, `medium`, or `long`), and the stored temporary filename.
- **Processing**: Calls Gemini API to generate structured JSON analysis. After successful summarization, deletes the temporary file from `server/uploads/`.
- **Response**:
  ```json
  {
    "success": true,
    "summary": {
      "summary": "Document summary paragraph...",
      "keyPoints": ["Key point 1", "Key point 2"],
      "mainIdeas": ["Main idea 1", "Main idea 2"],
      "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"]
    }
  }
  ```

---

## Temporary File Handling

Uploaded documents are saved to `server/uploads/` solely to enable text extraction (PDF parsing and image OCR).
- **Successful Processing**: Once the Gemini AI summary is successfully generated, the temporary file is deleted from disk using `fs.unlink` with `path.basename()` path sanitization.
- **Failure Resilience**: If AI summarization fails or encounters a network error, the temporary file is retained temporarily so the user can retry generation without re-uploading.

---

## Deployment

The application is designed for independent frontend and backend deployment:
- **Frontend**: Can be deployed to hosting providers such as Vercel, Netlify, or Cloudflare Pages. Configure `VITE_API_URL` to point to the deployed backend URL in the platform environment settings.
- **Backend**: Can be deployed to Node.js hosting providers such as Render, Railway, or Fly.io. Configure `PORT` and `GEMINI_API_KEY` in the hosting environment settings.

---

## Known Limitations

- **Language Scope**: Image OCR via Tesseract.js is currently configured for English text (`eng`).
- **Character Truncation**: Extremely long documents are capped at 50,000 characters before being sent to the Gemini API to adhere to prompt constraints.
- **Scanning Quality**: OCR extraction accuracy depends on image clarity, resolution, and contrast.

---

## Improvements / Future Enhancements

- **Multilingual OCR:** Extend Tesseract OCR support beyond English to handle documents in multiple languages.
- **Large Document Processing:** Replace the current 50,000-character limit with chunking and multi-step summarization for larger documents.
- **Better OCR Accuracy:** Add image preprocessing such as resizing, contrast adjustment, and noise reduction before OCR.
- **Persistent Document History:** Optionally allow users to save and revisit previous analyses instead of treating every upload as temporary.
- **More Export Formats:** Add PDF and Markdown export options in addition to the current TXT download.
- **Authentication and Access Control:** Add user authentication if persistent document history is introduced.
- **Improved AI Reliability:** Add structured response validation and retry/fallback handling for malformed AI responses.
- **Production Monitoring:** Add application logging and monitoring for production deployments.