import chromadb
from chromadb.utils import embedding_functions
import ollama

# 1. Initialize and get ChromaDB collection
def get_chromadb_collection(collection_name="log_chunks"):
    """
    Initialize ChromaDB and return collection
    """
    client = chromadb.Client()
    
    embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    
    try:
        collection = client.get_collection(
            name=collection_name,
            embedding_function=embedding_fn
        )
    except:
        collection = client.create_collection(
            name=collection_name,
            embedding_function=embedding_fn
        )
    
    return collection

# 2. Retrieve relevant chunks from ChromaDB
def retrieve_from_chromadb(query, n_results=5, collection=None):
    """
    Retrieve relevant chunks based on query
    
    Args:
        query: User's search query
        n_results: Number of chunks to retrieve
        collection: ChromaDB collection (if None, creates new)
    
    Returns:
        dict with documents, metadatas, and distances
    """
    if collection is None:
        collection = get_chromadb_collection()
    
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    
    return {
        "documents": results['documents'][0] if results['documents'] else [],
        "metadatas": results['metadatas'][0] if results['metadatas'] else [],
        "distances": results['distances'][0] if results['distances'] else []
    }

# 3. Generate response using retrieved chunks and Ollama
def generate_response_with_ollama(query, retrieved_chunks, model="llama2"):
    """
    Generate response using Ollama Llama2 based on retrieved chunks
    
    Args:
        query: User's question
        retrieved_chunks: Dict with documents and metadatas from retrieval
        model: Ollama model name
    
    Returns:
        Generated response string
    """
    # Prepare context from retrieved chunks
    contexts = retrieved_chunks.get("documents", [])
    metadatas = retrieved_chunks.get("metadatas", [])
    
    # Format context with metadata
    formatted_context = ""
    for i, (chunk, metadata) in enumerate(zip(contexts, metadatas)):
        if metadata:
            source = metadata.get('source_file', 'unknown')
            time_range = f"{metadata.get('start_time', 'N/A')} - {metadata.get('end_time', 'N/A')}"
            formatted_context += f"[Chunk {i+1} | Source: {source} | Time: {time_range}]\n{chunk}\n\n"
        else:
            formatted_context += f"[Chunk {i+1}]\n{chunk}\n\n"
    
    # Create prompt
    prompt = f"""Based on the following log data, answer the user's question accurately.

LOG DATA:
{formatted_context}

USER QUESTION: {query}

Provide a detailed answer based only on the log information above. If you find errors, warnings, or patterns, highlight them."""

    # Generate response
    response = ollama.chat(
        model=model,
        messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ],
        options={
            'temperature': 0.2,
            'num_predict': 500,
        }
    )
    
    return response['message']['content']

# Simple usage example:
if __name__ == "__main__":
    # Example query
    user_query = "What errors occurred in the angular application?"
    
    # Step 1: Get collection
    collection = get_chromadb_collection()
    
    # Step 2: Retrieve relevant chunks
    retrieved = retrieve_from_chromadb(user_query, n_results=5, collection=collection)
    
    # Step 3: Generate response
    response = generate_response_with_ollama(user_query, retrieved)
    
    print(f"Query: {user_query}")
    print(f"Response: {response}")
    print(f"Based on {len(retrieved['documents'])} chunks")