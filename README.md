# Quiz Generator App

A full-stack application that generates quizzes from your notes using AI.

## Features
- Upload text files or PDFs to extract content
- Manually enter notes and study materials
- Add example questions to guide the AI
- Generate multiple-choice quizzes from your notes
- Take quizzes and track your progress

## Tech Stack

- Frontend: React, Typescript
- Backend: FastAPI (Python)
- AI Integration: Groq API for quiz generation
- PDF processing

## Getting Started
### Prerequisites
- Node.js (v15.0.0 or later)
- Python 3.9+
- Groq API key

### Installation

1. Clone the repository

```sh
git clone https://github.com/yourusername/quiz_app.git
cd quiz_app
```
2. Set up the backend

```sh
cd backend
pip install -r requirements.txt
```

3. Create a .env file in the project root with your Groq API key

```
GROQ_API_KEY=your_groq_api_key_here
```

4. Set up the frontend

```sh
cd ../frontend
npm install
```


### Running the App

1. Start the backend server

```sh
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server

```sh
cd frontend
npm run dev
```
3. Open your browser and navigate to http://localhost:8080

### API Endpoints
```
POST /generate-quiz: Generate a quiz from notes (JSON input)
```
