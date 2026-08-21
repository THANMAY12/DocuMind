# DocuMind

> Turn documents into clear, actionable insights.

DocuMind is an AI-powered document analysis application that extracts text from PDF and image files and generates smart summaries, key points, main ideas, and improvement suggestions.

## Features

- Upload PDF and image documents
- Drag-and-drop document upload
- Extract text from PDFs
- OCR support for scanned documents
- AI-powered document summarization
- Short, medium, and long summaries
- Key points and main ideas
- Improvement suggestions
- Responsive and intuitive UI
- Loading and error states

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- Multer
- PDF parsing
- Tesseract.js

### AI
- Generative AI API

## Project Structure

```text
DocuMind/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md


Getting Started
Prerequisites
Node.js
npm
Frontend
cd client
npm install
npm run dev

The frontend runs on:

http://localhost:5173
Backend

Open another terminal:

cd server
npm install
npm run dev

The backend runs on:

http://localhost:5000
Development Status
Phase 1 — Project Setup
 React + Vite frontend
 Express backend
 Tailwind CSS setup
 Basic DocuMind UI
 Backend health-check API
 Project documentation
 Git configuration
Upcoming
 Document upload
 Drag-and-drop support
 PDF text extraction
 OCR for images
 AI summarization
 Summary length options
 Key points
 Improvement suggestions
 Error handling
 Production deployment
License

This project was created as a technical assessment project.