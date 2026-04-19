"""Reference Agent/RAG implementation behind the deployed AgriMind API.

The Streamlit app does not import this package at runtime. It is included to
make the capstone's LangGraph, RAG, Groq, and yield-prediction design visible
in the repository.
"""

from .knowledge_base import AGRONOMY_DOCS
from .schemas import CAT_COLS, MODEL_NAME, NUM_COLS, FarmState

__all__ = ["AGRONOMY_DOCS", "CAT_COLS", "MODEL_NAME", "NUM_COLS", "FarmState"]

