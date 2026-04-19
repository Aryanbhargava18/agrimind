"""Prompt builders used by the reference Groq/LangGraph agent."""

from __future__ import annotations

import json

from .schemas import FarmState


def build_reasoning_prompt(state: FarmState) -> str:
    farm_data = json.dumps(state["farm_data"], indent=2)
    context = "\n".join(f"- {doc}" for doc in state["retrieved_docs"])
    return f"""You are a senior agronomist advising a farmer.

FARM DATA:
{farm_data}

YIELD PREDICTION: {state['yield_prediction']:.2f} tons/hectare
YIELD CATEGORY: {state['yield_category']}

AGRONOMIC CONTEXT from the knowledge base:
{context}

Based only on the information above:
1. Explain why this yield was predicted given the farm conditions.
2. Identify the top 3 risk factors affecting yield.
3. Suggest 3-5 specific, actionable farming recommendations.

Be precise and practical. Do not hallucinate facts beyond what is provided."""


def build_report_prompt(reasoning: str) -> str:
    return f"""Convert the agronomic reasoning below into a structured JSON report.

REASONING:
{reasoning}

Return only valid JSON with exactly these keys:
- recommended_actions: list of objects, each with "task" and "description"
- agronomic_references: list of strings citing the agronomic principles used
- safety_disclaimer: one sentence about consulting professionals

No markdown and no explanation."""

