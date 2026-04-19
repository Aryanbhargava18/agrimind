"""Clean reference implementation of the Milestone 2 Agent/RAG pipeline.

This module mirrors the notebook architecture:
farm input -> yield prediction -> ChromaDB retrieval -> Groq reasoning ->
structured report. It is intentionally optional for the Streamlit frontend so
the public demo can stay lightweight and call the hosted FastAPI backend.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any, Mapping

from .knowledge_base import AGRONOMY_DOCS
from .prompts import build_reasoning_prompt, build_report_prompt
from .schemas import (
    CAT_COLS,
    DATASET_PATH,
    MODEL_NAME,
    NUM_COLS,
    YIELD_HIGH_THRESHOLD,
    YIELD_LOW_THRESHOLD,
    FarmState,
    make_initial_state,
)


@dataclass
class AgentRuntime:
    model: Any
    scaler: Any
    feature_cols: list[str]
    collection: Any
    groq_client: Any


def build_runtime(dataset_path: str = DATASET_PATH) -> AgentRuntime:
    """Create every runtime dependency required by the reference agent."""

    model, scaler, feature_cols = setup_model(dataset_path)
    collection = setup_knowledge_base()
    groq_client = get_groq_client()
    return AgentRuntime(
        model=model,
        scaler=scaler,
        feature_cols=feature_cols,
        collection=collection,
        groq_client=groq_client,
    )


def setup_model(dataset_path: str = DATASET_PATH) -> tuple[Any, Any, list[str]]:
    """Train the Linear Regression model using the Milestone 1 preprocessing."""

    import pandas as pd
    from sklearn.linear_model import LinearRegression
    from sklearn.preprocessing import StandardScaler

    df = pd.read_csv(dataset_path).dropna()
    df["Fertilizer_Used"] = df["Fertilizer_Used"].astype(int)
    df["Irrigation_Used"] = df["Irrigation_Used"].astype(int)

    q1 = df[NUM_COLS].quantile(0.25)
    q3 = df[NUM_COLS].quantile(0.75)
    iqr = q3 - q1
    df[NUM_COLS] = df[NUM_COLS].clip(q1 - 1.5 * iqr, q3 + 1.5 * iqr, axis=1)

    x = pd.get_dummies(
        df.drop("Yield_tons_per_hectare", axis=1),
        columns=CAT_COLS,
        drop_first=True,
    )
    y = df["Yield_tons_per_hectare"]
    feature_cols = x.columns.tolist()

    scaler = StandardScaler()
    x[NUM_COLS] = scaler.fit_transform(x[NUM_COLS])

    model = LinearRegression()
    model.fit(x, y)
    return model, scaler, feature_cols


def setup_knowledge_base(documents: list[str] | None = None) -> Any:
    """Create an in-memory ChromaDB collection for agronomy retrieval."""

    import chromadb
    from chromadb.utils import embedding_functions

    embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    client = chromadb.EphemeralClient()
    collection = client.get_or_create_collection(
        name="agronomy_kb",
        embedding_function=embedding_fn,
    )
    docs = documents or AGRONOMY_DOCS
    if collection.count() == 0:
        collection.add(documents=docs, ids=[f"doc_{index}" for index in range(len(docs))])
    return collection


def get_groq_client() -> Any:
    """Create the Groq client expected by the LLM nodes."""

    from groq import Groq

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise EnvironmentError("GROQ_API_KEY is not set.")
    return Groq(api_key=api_key)


def build_graph(runtime: AgentRuntime) -> Any:
    """Compile the LangGraph workflow for the advisory agent."""

    from langgraph.graph import END, START, StateGraph

    graph = StateGraph(FarmState)
    graph.add_node("predict", lambda state: node_predict(state, runtime))
    graph.add_node("retrieve", lambda state: node_retrieve(state, runtime))
    graph.add_node("reason", lambda state: node_reason(state, runtime))
    graph.add_node("report", lambda state: node_report(state, runtime))

    graph.add_edge(START, "predict")
    graph.add_edge("predict", "retrieve")
    graph.add_edge("retrieve", "reason")
    graph.add_edge("reason", "report")
    graph.add_edge("report", END)

    return graph.compile()


def node_predict(state: FarmState, runtime: AgentRuntime) -> dict[str, Any]:
    """Preprocess farm input and run the trained yield model."""

    import pandas as pd

    try:
        data = state["farm_data"].copy()
        data["Fertilizer_Used"] = int(data["Fertilizer_Used"])
        data["Irrigation_Used"] = int(data["Irrigation_Used"])

        row = pd.DataFrame([data])
        row = pd.get_dummies(row, columns=CAT_COLS, drop_first=True)
        row = row.reindex(columns=runtime.feature_cols, fill_value=0)
        row[NUM_COLS] = runtime.scaler.transform(row[NUM_COLS])

        prediction = float(runtime.model.predict(row)[0])
        category = (
            "Low"
            if prediction < YIELD_LOW_THRESHOLD
            else "High"
            if prediction > YIELD_HIGH_THRESHOLD
            else "Medium"
        )
        return {"yield_prediction": prediction, "yield_category": category, "error": ""}
    except Exception as exc:
        return {"error": str(exc), "yield_prediction": 0.0, "yield_category": "Unknown"}


def node_retrieve(state: FarmState, runtime: AgentRuntime) -> dict[str, Any]:
    """Retrieve the most relevant agronomy chunks for the field state."""

    if state.get("error"):
        return {"retrieved_docs": []}

    farm = state["farm_data"]
    query = (
        f"{farm['Crop']} {farm['Soil_Type']} {farm['Weather_Condition']} "
        f"{state['yield_category']} yield"
    )
    results = runtime.collection.query(query_texts=[query], n_results=4)
    return {"retrieved_docs": results["documents"][0]}


def node_reason(state: FarmState, runtime: AgentRuntime) -> dict[str, Any]:
    """Call Groq to reason over prediction plus retrieved agronomy context."""

    if state.get("error"):
        return {"llm_reasoning": ""}

    try:
        reasoning = call_llm(runtime, build_reasoning_prompt(state))
        return {"llm_reasoning": reasoning}
    except Exception as exc:
        return {"error": str(exc), "llm_reasoning": ""}


def node_report(state: FarmState, runtime: AgentRuntime) -> dict[str, Any]:
    """Convert raw reasoning into a stable structured advisory report."""

    if state.get("error") and not state.get("llm_reasoning"):
        return {"advisory_report": normalize_report({}, state)}

    try:
        raw_json = call_llm(
            runtime,
            build_report_prompt(state["llm_reasoning"]),
            json_mode=True,
        )
        return {"advisory_report": normalize_report(json.loads(raw_json), state)}
    except Exception:
        return {"advisory_report": normalize_report({}, state)}


def call_llm(runtime: AgentRuntime, prompt: str, *, json_mode: bool = False) -> str:
    kwargs: dict[str, Any] = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
    }
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    response = runtime.groq_client.chat.completions.create(**kwargs)
    return response.choices[0].message.content


def normalize_report(raw: Mapping[str, Any], state: FarmState) -> dict[str, Any]:
    """Guarantee the final report keeps the public response schema."""

    farm = state["farm_data"]

    def action_list(actions: Any) -> list[dict[str, str]]:
        if not isinstance(actions, list):
            return []
        result: list[dict[str, str]] = []
        for action in actions:
            if isinstance(action, Mapping):
                result.append(
                    {
                        "task": str(action.get("task", "Recommendation")),
                        "description": str(action.get("description", "")),
                    }
                )
            else:
                result.append({"task": "Recommendation", "description": str(action)})
        return result

    return {
        "crop_summary": {
            "crop_name": farm.get("Crop", "N/A"),
            "region": farm.get("Region", "N/A"),
            "yield_prediction": f"{state['yield_prediction']:.2f} tons/hectare",
            "yield_category": state["yield_category"],
        },
        "field_status": {
            "soil_type": farm.get("Soil_Type", "N/A"),
            "rainfall_mm": farm.get("Rainfall_mm", "N/A"),
            "temperature": f"{farm.get('Temperature_Celsius', 'N/A')} C",
            "irrigation": farm.get("Irrigation_Used", "N/A"),
            "fertilizer": farm.get("Fertilizer_Used", "N/A"),
            "weather": farm.get("Weather_Condition", "N/A"),
        },
        "yield_risk_level": state["yield_category"],
        "recommended_actions": action_list(raw.get("recommended_actions", [])),
        "agronomic_references": [str(ref) for ref in raw.get("agronomic_references", [])],
        "safety_disclaimer": raw.get(
            "safety_disclaimer",
            "Consult a certified local agronomist before implementing recommendations.",
        ),
    }


def run_farm_advisory(
    farm_input: dict[str, Any],
    *,
    runtime: AgentRuntime | None = None,
    dataset_path: str = DATASET_PATH,
) -> dict[str, Any]:
    """Convenience runner for local reference execution."""

    active_runtime = runtime or build_runtime(dataset_path)
    graph = build_graph(active_runtime)
    result = graph.invoke(make_initial_state(farm_input))
    return result["advisory_report"]

