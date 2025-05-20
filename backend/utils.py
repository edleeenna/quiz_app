# utils.py
from fastapi import UploadFile
import fitz  # PyMuPDF

async def extract_text_from_file(file: UploadFile) -> str:
    if file.content_type == "application/pdf":
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = "\n".join([page.get_text() for page in doc])
        return text
    else:
        return (await file.read()).decode("utf-8")