import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from genai_capstone import run_farm_advisory, setup_model, setup_knowledge_base

# Load environment variables (for local testing)
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize once on startup
    setup_knowledge_base()
    setup_model()
    yield

app = FastAPI(lifespan=lifespan)

class FarmInput(BaseModel):
    Region: str
    Soil_Type: str
    Crop: str
    Rainfall_mm: float
    Temperature_Celsius: float
    Fertilizer_Used: bool
    Irrigation_Used: bool
    Weather_Condition: str
    Days_to_Harvest: int

@app.get("/")
def home():
    return {"message": "Farm Advisory API Running 🚀"}

@app.post("/predict")
def predict(data: FarmInput):
    # Advisory report generation
    return run_farm_advisory(data.dict())