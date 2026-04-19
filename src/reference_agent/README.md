# Reference Agent/RAG Implementation

This package is included for rubric evidence. The live Streamlit app calls the
hosted FastAPI backend, while this reference code shows the agentic design
extracted from `GENAI_capstone.ipynb`.

Pipeline:

1. Train the Milestone 1 crop-yield Linear Regression model.
2. Build an in-memory ChromaDB collection from agronomy knowledge chunks.
3. Compile a LangGraph workflow with prediction, retrieval, reasoning, and
   report-formatting nodes.
4. Use Groq `llama-3.1-8b-instant` for grounded agronomic reasoning.
5. Return the same structured JSON schema consumed by the frontend.

Optional local setup:

```bash
pip install -r requirements-agent.txt
export GROQ_API_KEY="your-groq-key"
```

The local runner also needs `crop_yield.csv`, which is intentionally not bundled
in this frontend repo.

