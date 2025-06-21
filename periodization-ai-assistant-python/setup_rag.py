# necessary imports for pdf unloader
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# necessary imports for semantic search
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import Pinecone

# necessary imports for pinecone
from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import os
import json

print("Loading PDF...")
loader = PyPDFLoader("data.pdf")
data = loader.load()
print("Loaded PDF.")

# Combine all content into a single string
print("Merging all pages into single document...")
full_text = "\n\n".join([doc.page_content for doc in data])
merged_doc = Document(page_content=full_text)
data = [merged_doc]
# print(len(data))
# print(len(data[0].page_content))
print("Merged.")

# Chunk splitting
print("Chunk splitting...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
texts = text_splitter.split_documents(data)
# print(len(texts))
# print(texts)
print("Chunk split.")

# Create embeddings
# Initialize Pinecone
print("Create embeddings and initialize Pinecone...")
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
print("Created and initialized.")

# Create a Pinecone index
print("Create pinecone index...")
pc.create_index(
    name="periodization",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)
print("Created.")

# Generate embedding vectors from chunks
print("Generate embedding vectors from chunks...")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
embedded_texts = []

for i, doc in enumerate(texts):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=doc.page_content
    )
    vector = response.data[0].embedding
    embedded_texts.append({
        "id": f"doc-{i}",
        "values": vector,
        "metadata": {
            "source": "data.pdf",
            "chunk": i,
            "text": doc.page_content
        }
    })
    print("Generated chunk:", i)
print("Finished generating.")

# Upsert into Pinecone
print("Upserting into Pinecone...")
index = pc.Index("periodization")
from tqdm import tqdm
BATCH_SIZE = 100  # or lower if vectors are large

for i in tqdm(range(0, len(embedded_texts), BATCH_SIZE)):
    batch = embedded_texts[i:i+BATCH_SIZE]
    index.upsert(vectors=batch, namespace="ns1")

print(f"✅ Upserted {len(embedded_texts)} vectors to Pinecone.")
print(index.describe_index_stats())


# docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)
