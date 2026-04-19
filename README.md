# Intelligent Crop Yield Prediction & Agentic Farm Advisory 🌾🤖

[![Python 3.10](https://shields.io)](https://python.org)
[![Framework](https://shields.io)](https://palletsprojects.com)
[![Hosting](https://shields.io)](https://render.com)



An AI-driven agricultural analytics system that predicts crop yield using classical Machine Learning and provides autonomous farming advice via an Agentic AI workflow.

---

## 📖 Project Overview
This project addresses real-world agricultural challenges by bridging the gap between predictive analytics and actionable advice.

*   **Milestone 1:** Implements a predictive model using Scikit-Learn to estimate yield based on soil and weather data.
*   **Milestone 2:** Evolves the system into an **Agentic AI Assistant** using **LangGraph**. The agent reasons about predicted risks, retrieves agronomic best practices using **RAG**, and generates structured advisory reports.

## 🛠️ Technology Stack
- **Machine Learning:** Scikit-Learn (Random Forest/Decision Trees)
- **Agent Orchestration:** LangGraph & LangChain
- **LLM:** \[Insert Model, e.g., Google Gemini / OpenAI GPT-4]
- **Vector Database:** Chroma / FAISS (for RAG-based agronomy guides)
- **Deployment:** Render / Streamlit Community Cloud

## 📂 Repository Structure
```
├── GENAI_capstone.ipynb   # Exploratory Data Analysis & Model Training
├── train_model.py         # Script to train and save the ML model
├── model.joblib           # Serialized ML model for production use
├── genai_capstone.py      # Core Agentic logic and LangGraph workflow
├── main.py                # Entry point for the Streamlit/UI application
├── crop_yield.csv         # Historical agricultural dataset
├── requirements.txt       # Project dependencies
├── .gitignore             # Excludes __pycache__, .env, and OS metadata
└── runtime.txt            # Environment configuration for deployment
```

## 🚀 Setup & Installation

1. Clone the Repository
   ```
   git clone https://github.com
    cd GENAI-capstone
    ```
2. Environment Setup

It is recommended to use Python 3.10.
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
3. API Configuration
  
Create a .env file in the root directory and add your API keys:
```
GOOGLE_API_KEY=your_key_here
# OR
OPENAI_API_KEY=your_key_here
```

4. Running the Application
   ```
   streamlit run main.py
   ```
## 🤖 Agent Workflow

The system utilizes a state-based workflow defined in genai_capstone.py:
Analyze: Process the yield prediction from model.joblib.
Retrieve: Fetch relevant farming guidelines from the vector store.
Reason: Use an LLM agent to evaluate conditions and plan management strategies.
Report: Generate a structured farm advisory report with actionable steps.

## 📊 Evaluation
Predictive Accuracy: Evaluated via MAE and RMSE metrics.
Agent Performance: Assessed based on reasoning quality and the utility of the generated agronomic advice.

## 📜 License
This project is licensed under the NST License.

