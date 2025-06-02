import os
import uuid
from pinecone import Pinecone, ServerlessSpec
import numpy as np
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone client
pinecone_client = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Connect to or create the index
index_name = "quiz-notes"
if index_name not in [i.name for i in pinecone_client.list_indexes()]:
    pinecone_client.create_index(
        name=index_name,
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region=os.getenv("PINECONE_ENV")  # e.g., "us-west-2"
        )
    )

# Connect to the index
index = pinecone_client.Index(index_name)

# Lazy loading of embedding model
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        print("[DEBUG] Loading embedding model for the first time...")
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        print("[DEBUG] Embedding model loaded successfully.")
    return _embedding_model


def store_note_chunks(notes_id: str, content: str, chunk_size: int = 500):
    print(f"[DEBUG] Storing note chunks for notes_id={notes_id}...")

    chunks = [content[i:i+chunk_size] for i in range(0, len(content), chunk_size)]
    print(f"[DEBUG] Created {len(chunks)} chunks.")

    embedding_model = get_embedding_model()
    embeddings = embedding_model.encode(chunks)  # shape: (n_chunks, 384)
    print(f"[DEBUG] Generated embeddings for chunks.")

    vectors = []
    for emb, chunk in zip(embeddings, chunks):
        emb_list = emb.tolist()  # Convert NumPy array to plain Python list
        metadata = {"notes_id": str(notes_id), "text": str(chunk)}
        vector_id = f"{notes_id}-{uuid.uuid4()}"
        vectors.append((vector_id, emb_list, metadata))

    print(f"[DEBUG] Prepared {len(vectors)} vectors for upsert.")

    try:
        index.upsert(vectors=vectors)
        print("[DEBUG] Upsert successful.")
    except Exception as e:
        print(f"[ERROR] Upsert failed: {e}")
        raise

def retrieve_context(notes_id: str, query: str, top_k: int = 5) -> str:
    """Retrieve top-k relevant chunks for a query scoped to a notes_id."""
    print(f"[DEBUG] Retrieving context for notes_id={notes_id} and query='{query}'...")
    try:
        # Generate embedding for the query
        embedding_model = get_embedding_model()
        query_embedding = embedding_model.encode([query])[0].tolist()
        print(f"[DEBUG] Query embedding: {query_embedding[:10]}...")  # Print first 10 values for debugging

        # Query the Pinecone index
        results = index.query(
            vector=query_embedding,
            filter={"notes_id": notes_id},
            top_k=top_k,
            include_metadata=True
        )
        print(f"[DEBUG] Full query response: {results}")

        # Handle empty results
        if not results.get("matches", []):
            print(f"[DEBUG] No matches found for notes_id={notes_id} and query='{query}'.")
            return ""

        # Extract the text from the metadata of the top-k matches
        context_chunks = [match["metadata"]["text"] for match in results.get("matches", [])]
        print(f"[DEBUG] Retrieved {len(context_chunks)} context chunks.")

        # Combine the chunks into a single context string
        context = "\n".join(context_chunks)
        print(f"[DEBUG] Combined context: {context[:200]}...")  # Print first 200 characters for debugging

        return context
    except Exception as e:
        print(f"[ERROR] Failed to retrieve context: {e}")
        raise

def delete_note_chunks(notes_id: str):
    print(f"[DEBUG] Retrieving IDs for vectors with notes_id={notes_id}...")
    try:
        dummy_vector = [0.0] * 384  # Same dimension as your embeddings
        results = index.query(
            vector=dummy_vector,
            filter={"notes_id": notes_id},
            top_k=1000,
            include_metadata=False
        )

        print(f"[DEBUG] Full query response: {results}")
        vector_ids = [match["id"] for match in results.get("matches", [])]
        print(f"[DEBUG] Retrieved vector IDs: {vector_ids}")

        if not vector_ids:
            print(f"[DEBUG] No vectors found for notes_id={notes_id}. Skipping deletion.")
            return

        print(f"[DEBUG] Deleting {len(vector_ids)} vectors for notes_id={notes_id}...")
        index.delete(ids=vector_ids)
        print("[DEBUG] Note chunks deleted successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to delete note chunks: {e}")
        raise