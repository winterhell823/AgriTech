"""
RAG Chatbot Explainer
---------------------
Combines retrieved ChromaDB rules with field prediction metrics
to generate clear natural language answers.
"""

from app.rag.vector_store import query_vector_store

def generate_ai_assistant_response(field_id: str, crop: str, stage: str, stress: str, user_question: str) -> str:
    """
    Generates a grounded natural language response explaining field metrics.
    """
    # 1. Retrieve knowledge rules from ChromaDB
    retrieved_rules = query_vector_store(user_question, n_results=2)
    rules_context = " ".join(retrieved_rules)
    
    # 2. Synthesize explanation
    response = (
        f"🌾 **Field {field_id} Report:**\n"
        f"- **Crop Detected:** {crop}\n"
        f"- **Growth Stage:** {stage}\n"
        f"- **Moisture Condition:** {stress} Stress\n\n"
        f"💡 **Explanation & Recommendation:**\n"
        f"Based on satellite vegetation indices (NDWI/NDVI) and weather observations: {rules_context}"
    )
    return response

if __name__ == "__main__":
    reply = generate_ai_assistant_response("1024", "Wheat", "Flowering", "Moderate", "Why is this field stressed?")
    print(reply)