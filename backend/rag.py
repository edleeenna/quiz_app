import os
import uuid
import logging
from pinecone import Pinecone, ServerlessSpec, EmbeddingsList
from dotenv import load_dotenv

load_dotenv()

# Global singletons
pinecone_client = None
pinecone_index = None

INDEX_NAME = "llama-text-embed-v2-index"
DIMENSION = 1024
EMBEDDING_MODEL = "llama-text-embed-v2"  # or your preferred model


def get_index():
    global pinecone_client, pinecone_index

    if pinecone_client is None:
        logging.info("Initializing Pinecone client...")
        pinecone_client = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

    if pinecone_index is None:
        logging.info("Checking or creating index...")
        if INDEX_NAME not in [i.name for i in pinecone_client.list_indexes()]:
            pinecone_client.create_index(
                name=INDEX_NAME,
                dimension=DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=os.getenv("PINECONE_ENV")
                )
            )

        pinecone_index = pinecone_client.Index(INDEX_NAME)

    return pinecone_index


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate embeddings using Pinecone's inference API"""
    try:
        # Use the inference plugin for embeddings
        response = pinecone_client.inference.embed(
            model=EMBEDDING_MODEL,
            inputs=texts,
            parameters={
                "input_type": "passage",
                "truncate": "END"
            }
        )
        
        # Extract the embedding values from the response
        return [embedding.values for embedding in response.data]
        
    except Exception as e:
        logging.error(f"Embedding generation failed: {e}")
        raise


def store_note_chunks(notes_id: str, content: str, chunk_size: int = 500):
    logging.debug(f"Storing note chunks for notes_id={notes_id}")
    chunks = [content[i:i+chunk_size] for i in range(0, len(content), chunk_size)]
    embeddings = generate_embeddings(chunks)

    vectors = []
    for emb, chunk in zip(embeddings, chunks):
        vectors.append((
            f"{notes_id}-{uuid.uuid4()}",
            emb,
            {"notes_id": notes_id, "text": chunk}
        ))

    try:
        index = get_index()
        index.upsert(vectors=vectors)
        logging.debug("Upsert successful.")
    except Exception as e:
        logging.error(f"Upsert failed: {e}")
        raise


def retrieve_context(notes_id: str, query: str, top_k: int = 5) -> str:
    logging.debug(f"Retrieving context for notes_id={notes_id}")
    try:
        query_embedding = generate_embeddings([query])[0]
        index = get_index()

        results = index.query(
            vector=query_embedding,
            filter={"notes_id": notes_id},
            top_k=top_k,
            include_metadata=True
        )

        if not results.get("matches"):
            logging.debug("No matches found.")
            return ""

        chunks = [match["metadata"]["text"] for match in results["matches"]]
        return "\n".join(chunks)
    except Exception as e:
        logging.error(f"Context retrieval failed: {e}")
        raise


def delete_note_chunks(notes_id: str):
    logging.debug(f"Deleting chunks for notes_id={notes_id}")
    try:
        dummy_vector = [0.0] * DIMENSION
        index = get_index()

        results = index.query(
            vector=dummy_vector,
            filter={"notes_id": notes_id},
            top_k=1000,
            include_metadata=False
        )

        vector_ids = [match["id"] for match in results.get("matches", [])]
        if vector_ids:
            index.delete(ids=vector_ids)
            logging.debug(f"Deleted {len(vector_ids)} vectors.")
        else:
            logging.debug("No vectors found to delete.")
    except Exception as e:
        logging.error(f"Deletion failed: {e}")
        raise