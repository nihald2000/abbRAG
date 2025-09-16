# rag_query.py
import argparse
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain import PromptTemplate, LLMChain
from langchain.chains import RetrievalQA

def main(args):
    # 1️⃣ Load the persisted vector store
    embeddings = OllamaEmbeddings(
        model=args.embedding_model,
        base_url="http://localhost:11434",
    )
    db = Chroma(
        collection_name=args.collection_name,
        embedding_function=embeddings,
        persist_directory=args.persist_dir,
    )

    # 2️⃣ Set up the retriever (you can tweak k=4 to return more/less docs)
    retriever = db.as_retriever(search_kwargs={"k": args.k})

    # 3️⃣ Load the generative LLM (the same or a different model)
    llm = Ollama(
        model=args.gen_model,
        base_url="http://localhost:11434",
        temperature=args.temperature,
    )

    # 4️⃣ Prompt template – feel free to edit
    template = """
    Use the following context (delimited by <ctx> and </ctx>) to answer the question.
    If the answer is not in the context, say "I don't have that information."

    <ctx>
    {context}
    </ctx>

    Question: {question}
    Answer (concise, friendly):
    """
    prompt = PromptTemplate.from_template(template)

    # 5️⃣ Build the QA chain
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt},
    )

    # 6️⃣ Interactive loop
    while True:
        query = input("\nQuery (or type 'exit'): ").strip()
        if query.lower() in {"exit", "quit"}:
            break
        result = qa({"question": query})
        answer = result["answer"]
        sources = result["source_documents"]
        print("\n=== ANSWER ===")
        print(answer)
        if sources:
            print("\n=== SOURCES ===")
            for i, doc in enumerate(sources, 1):
                print(f"{i}. {doc.metadata.get('source', 'unknown')}")
        else:
            print("\n(no sources found)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Query a RAG index built with Ollama")
    parser.add_argument("--persist_dir", default="./chroma_db", help="Directory of the Chroma DB")
    parser.add_argument("--collection_name", default="rag", help="Chroma collection name")
    parser.add_argument("--embedding_model", default="llama3", help="Model for embeddings")
    parser.add_argument("--gen_model", default="llama3", help="Model for generation")
    parser.add_argument("-k", type=int, default=4, help="Number of docs to retrieve")
    parser.add_argument("--temperature", type=float, default=0.7, help="LLM temperature")
    args = parser.parse_args()
    main(args)