from pydantic import BaseModel
from typing import List, Optional

class NotesFile(BaseModel):
    id: str
    name: str
    content: str
    example_questions: Optional[List[str]] = None

class NotesFileResponse(BaseModel):
    content: str
    example_questions: Optional[List[str]] = None

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class QuizResponse(BaseModel):
    generated_from: str
    questions: List[QuizQuestion]