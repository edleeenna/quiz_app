# Quiz Generator App

A full-stack application that generates quizzes from your notes using AI.

## Deployment Information
- Frontend deployed to vercel: https://quiz-app-rho-brown.vercel.app/
- Backend deployed on Render.com (a free instance, so it will go to sleep with inactivity. Please note that this means AI generation will be slow as the backend reboots :smile: )

## Features
- Upload text files, DOCX or PDFs to extract content
- Manually enter notes and study materials
- Add example questions to guide the AI
- Generate multiple-choice quizzes from your notes
- Take quizzes and track your progress
- View past quizzes and retake them

## Future Scope
- Implement RAG

## Tech Stack

- Frontend: React, Typescript
- Backend: FastAPI (Python)
- AI Integration: Groq API for quiz generation (NOT to be confused with Grok :wink: )
- RAG
  - Chromadb

## Diagram
![image](https://github.com/user-attachments/assets/cbe1eb86-8259-42e5-b477-003e69648a5c)


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
