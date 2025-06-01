from typing import Optional
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import NotesFile, QuizResponse
from ai_generator import generate_quiz_from_notes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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



# If in future you want to add file upload functionality, save to db and then generate quiz
#@app.post("/upload-notes", response_model=NotesFileResponse)
# async def upload_notes(file: UploadFile = File(...), name: str = Form(...), example_questions: str = Form(None)):
#    try:
#        content = await extract_text_from_file(file)
#        notes_file = NotesFile(
#            id=str(uuid.uuid4()),
#            name=name,
#            content=content,
#            example_questions=example_questions.split('\n') if example_questions else None
#        )
#        #questions = generate_quiz_from_notes(notes_file)
#        return NotesFileResponse(content=notes_file.content, example_questions=example_questions.split('\n') if example_questions else None)
#
#    except Exception as e:
#        raise HTTPException(status_code=500, detail=str(e))