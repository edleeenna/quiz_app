import logging
from typing import Optional
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rag import delete_note_chunks, store_note_chunks, get_index
from models import NotesFile, QuizResponse, NotesUploadResponse
from ai_generator import generate_quiz_from_notes


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

## Implement a lazy warmup to prevents the “cold start + garbage output” issue.
@app.get("/warmup")
async def warmup():
    try:
        index = get_index()
        stats = index.describe_index_stats()
        return {"status": "warm", "namespaces": list(stats.get("namespaces", {}).keys())}
    except Exception as e:
        logging.exception("Warmup failed:")
        return {"status": "error", "details": str(e)}


@app.post("/generate-quiz", response_model=QuizResponse)
async def generate_quiz_endpoint(
    id: str = Form(...),
    name: str = Form(...),
    content: str = Form(...),
    num_questions: str = Form(...),
    example_questions: Optional[str] = Form(None)
):
    try:
        notes_file_data = NotesFile(
            id=id,
            name=name,
            content=content,
            num_questions=num_questions,
            example_questions=example_questions
        )
        questions = generate_quiz_from_notes(notes_file_data)
        return QuizResponse(generated_from=name, questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload-notes", response_model=NotesUploadResponse)
async def upload_notes_endpoint(
    id: str = Form(...),
    name: str = Form(...),
    content: str = Form(...)
):
    """
    Upload and store notes in the RAG system (Pinecone).
    This endpoint handles the storage of notes for later quiz generation.
    """
    try:
        # Delete any existing chunks for this notes_id (in case of re-upload)
        delete_note_chunks(id)
        
        # Store the new note chunks in Pinecone
        store_note_chunks(id, content)
        
        return NotesUploadResponse(
            id=id,
            name=name,
            message=f"Notes '{name}' uploaded successfully",
            chunks_stored=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload notes: {str(e)}")