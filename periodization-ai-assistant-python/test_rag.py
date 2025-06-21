# query_rag.py

from dotenv import load_dotenv
load_dotenv()

import os
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_pinecone import Pinecone
from langchain.chains import RetrievalQA

# Initialize Pinecone + OpenAI Embeddings
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

from pinecone import Pinecone as PineconeClient
pc = PineconeClient(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("periodization")

# Connect to existing vector index via LangChain
vectorstore = Pinecone(
    index=index,
    embedding=embeddings,
    namespace="ns1"
)

# Create retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Create retrieval-augmented QA chain
llm = ChatOpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"))
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever
)

# Example query
query = "What is the mechanism for muscle contraciton?"
response = qa_chain.run(query)

print("\n💬 AI Answer:", response)