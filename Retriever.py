import chromadb
from chromadb.utils import embedding_functions
import ollama
from typing import List, Dict

class Retriever:
    def __init__(self, collection_name="log_chunks"):
        # Initialize ChromaDB client
        self.client = chromadb.Client()
        
        # Use lightweight embedding model for CPU
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Get or create collection
        try:
            self.collection = self.client.get_collection(
                name=collection_name,
                embedding_function=self.embedding_fn
            )
        except:
            self.collection = self.client.create_collection(
                name=collection_name,
                embedding_function=self.embedding_fn
            )
    
    def retrieve(self, query: str, n_results: int = 5, filters: Dict = None):
        """
        Retrieve relevant chunks from ChromaDB
        
        Args:
            query: User's search query
            n_results: Number of chunks to retrieve
            filters: Optional metadata filters
        
        Returns:
            Dictionary with documents and metadata
        """
        # Basic retrieval
        if filters is None:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
        else:
            # Retrieval with metadata filtering
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results,
                where=filters
            )
        
        return {
            "documents": results['documents'][0] if results['documents'] else [],
            "metadatas": results['metadatas'][0] if results['metadatas'] else [],
            "distances": results['distances'][0] if results['distances'] else []
        }

class ResponseGenerator:
    def __init__(self, model_name="llama2"):
        self.model_name = model_name
        
    def generate(self, query: str, contexts: List[str], metadatas: List[Dict] = None):
        """
        Generate response using Ollama Llama2
        
        Args:
            query: User's question
            contexts: Retrieved log chunks
            metadatas: Optional metadata for each chunk
        
        Returns:
            Generated response
        """
        # Prepare context with metadata if available
        if metadatas:
            formatted_contexts = []
            for i, (context, metadata) in enumerate(zip(contexts, metadatas)):
                meta_str = f"[Source: {metadata.get('source_file', 'unknown')}, " \
                          f"Time: {metadata.get('start_time', 'N/A')} - {metadata.get('end_time', 'N/A')}]"
                formatted_contexts.append(f"{meta_str}\n{context}")
            context_text = "\n\n---\n\n".join(formatted_contexts)
        else:
            context_text = "\n\n---\n\n".join(contexts)
        
        # Create prompt
        prompt = f"""You are analyzing system logs to help answer questions. Based on the retrieved log data below, provide a detailed and accurate answer to the user's question.

Retrieved Log Data:
{context_text}

User Question: {query}

Instructions:
1. Analyze the log patterns and extract relevant information
2. If you notice any errors or warnings, highlight them
3. Provide specific details from the logs (timestamps, endpoints, status codes, etc.)
4. If the logs don't contain enough information to fully answer the question, state what's missing

Answer:"""

        # Generate response using Ollama
        response = ollama.chat(
            model=self.model_name,
            messages=[
                {
                    'role': 'system',
                    'content': 'You are a helpful log analysis assistant. Provide detailed answers based on the log data provided.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            options={
                'temperature': 0.2,  # Lower temperature for more factual responses
                'num_predict': 500,  # Limit response length
            }
        )
        
        return response['message']['content']

class LogRAGSystem:
    def __init__(self):
        self.retriever = Retriever()
        self.generator = ResponseGenerator()
    
    def query(self, 
              user_query: str, 
              n_chunks: int = 5,
              filters: Dict = None):
        """
        Main query interface for the RAG system
        
        Args:
            user_query: User's question about the logs
            n_chunks: Number of chunks to retrieve
            filters: Optional filters (e.g., {'log_level': 'ERROR'})
        
        Returns:
            Dictionary with response and sources
        """
        # Step 1: Retrieve relevant chunks
        retrieval_results = self.retriever.retrieve(
            query=user_query,
            n_results=n_chunks,
            filters=filters
        )
        
        if not retrieval_results['documents']:
            return {
                "response": "No relevant log data found for your query.",
                "sources": [],
                "chunks_used": 0
            }
        
        # Step 2: Generate response
        response = self.generator.generate(
            query=user_query,
            contexts=retrieval_results['documents'],
            metadatas=retrieval_results['metadatas']
        )
        
        return {
            "response": response,
            "sources": retrieval_results['metadatas'],
            "chunks_used": len(retrieval_results['documents']),
            "relevance_scores": retrieval_results['distances']
        }

    
        
