import logging
from genai_capstone import setup_model, setup_knowledge_base

# Setup logging
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    print("🚀 Starting Pre-training and Knowledge Base Initialization...")
    
    # 1. Train and save the ML model
    setup_model()
    
    # 2. Initialize the knowledge base (optional but good for testing)
    setup_knowledge_base()
    
    print("✅ Pre-training complete! 'model.joblib' generated.")
