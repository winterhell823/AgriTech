"""
RAG AI Assistant Vector Store (ChromaDB)
----------------------------------------
Indexes agricultural documentation, phenology guides, drought thresholds,
and field metrics into a ChromaDB vector database using Sentence-Transformers.
"""

import os
import chromadb
from chromadb.utils import embedding_functions

CHROMA_DATA_PATH = "data_samples/chroma_db"

def get_vector_collection():
    """Initializes ChromaDB client and returns the agricultural knowledge collection."""
    os.makedirs(CHROMA_DATA_PATH, exist_ok=True)
    client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
    
    # Use standard sentence-transformer model for embedding
    emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    collection = client.get_or_create_collection(name="agri_knowledge", embedding_function=emb_fn)
    return collection

def seed_agri_knowledge():
    """Seeds ChromaDB with initial agricultural rules, stress guidelines, and crop stage knowledge."""
    collection = get_vector_collection()
    
    docs = [
        "Moisture Stress - Moderate: Triggered when NDWI drops below -0.15, rainfall is 30% below 14-day average, and temperatures exceed 32°C. Recommended action: Light irrigation within 48 hours.",
        "Moisture Stress - Severe: Triggered when NDWI drops below -0.30 and soil moisture deficit exceeds 60%. Recommended action: Immediate priority irrigation and field inspection.",
        "Wheat Phenology - Flowering Stage: Wheat requires steady moisture during flowering (March). High heat during flowering causes grain drying.",
        "Rice Phenology - Vegetative Stage: Paddy fields require standing water depth during vegetative growth (July-August)."
    ]
    
    ids = ["rule_mod_stress", "rule_sev_stress", "wheat_flowering", "rice_vegetative"]
    metadatas = [{"category": "stress_rule"}, {"category": "stress_rule"}, {"category": "phenology"}, {"category": "phenology"}]
    
    collection.add(documents=docs, ids=ids, metadatas=metadatas)
    print(f"📚 Seeded ChromaDB vector database with {len(docs)} knowledge rules.")

def query_vector_store(query_text: str, n_results: int = 2):
    """Retrieves relevant context for user queries."""
    collection = get_vector_collection()
    results = collection.query(query_texts=[query_text], n_results=n_results)
    return results["documents"][0]

if __name__ == "__main__":
    print("Testing ChromaDB Vector Store...")
    seed_agri_knowledge()
    retrieved = query_vector_store("Why is field under moderate stress?")
    print(f"✅ Retrieved RAG Context: {retrieved}")