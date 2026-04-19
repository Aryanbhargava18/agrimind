"""Shared schema and constants for the reference Agent/RAG pipeline."""

from __future__ import annotations

from typing import Any, List, TypedDict


MODEL_NAME = "llama-3.1-8b-instant"
DATASET_PATH = "crop_yield.csv"

NUM_COLS = ["Rainfall_mm", "Temperature_Celsius", "Days_to_Harvest"]
CAT_COLS = ["Region", "Soil_Type", "Crop", "Weather_Condition"]

YIELD_LOW_THRESHOLD = 3.0
YIELD_HIGH_THRESHOLD = 6.0


class FarmState(TypedDict):
    farm_data: dict[str, Any]
    yield_prediction: float
    yield_category: str
    retrieved_docs: List[str]
    llm_reasoning: str
    advisory_report: dict[str, Any]
    error: str


def make_initial_state(farm_data: dict[str, Any]) -> FarmState:
    return {
        "farm_data": farm_data,
        "yield_prediction": 0.0,
        "yield_category": "",
        "retrieved_docs": [],
        "llm_reasoning": "",
        "advisory_report": {},
        "error": "",
    }

