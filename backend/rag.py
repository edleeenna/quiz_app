import os
import uuid
import chromadb
from chromadb.utils import embedding_functions
from langchain.text_splitter import RecursiveCharacterTextSplitter


EMBEDDING_MODEL = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
CHROMA_DIR = "rag_chroma_store"

client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = client.get_or_create_collection(name="quiz_notes", embedding_function=EMBEDDING_MODEL)

# --- Configurable chunking ---
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)


def store_note_chunks(note_id: str, notes_content: str):
    """Split and store notes with metadata for scoped retrieval."""
    chunks = text_splitter.split_text(notes_content)
    ids = [f"{note_id}_{i}_{uuid.uuid4()}" for i in range(len(chunks))]

    metadatas = [{"note_id": note_id, "type": "quiz_chunk"}] * len(chunks)
    collection.add(documents=chunks, ids=ids, metadatas=metadatas)
    print(f"[RAG] Stored {len(chunks)} chunks for note_id={note_id}")


def retrieve_context(note_id: str, query: str, top_k: int = 5) -> str:
    """Retrieve relevant context chunks for a given query scoped to a note_id."""
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where={"note_id": note_id}
    )

    retrieved_docs = results.get("documents", [[]])[0]
    unique_chunks = list(dict.fromkeys(retrieved_docs))  # remove duplicates, preserve order

    print(f"[RAG] Retrieved {len(unique_chunks)} unique chunks for query")
    return "\n\n".join(unique_chunks[:top_k])
