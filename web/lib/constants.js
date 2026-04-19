import {
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  CloudRain,
  Droplets,
  FileJson,
  Leaf,
  MapPinned,
  ShieldAlert,
  Sprout,
  Sun,
  Wheat,
  Workflow,
  Zap,
} from 'lucide-react';

export const BACKEND_HEALTH_URL = import.meta.env.VITE_BACKEND_URL || 'https://genai-capstone-1.onrender.com';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const STORAGE_KEYS = {
  result: 'agrimind:last-result',
  form: 'agrimind:last-form',
};

export const agentTrace = [
  {
    title: 'Input Validation',
    detail: 'React Hook Form and Zod verify every field before submission.',
  },
  {
    title: 'Yield Predictor',
    detail: 'The backend model predicts crop yield in tons per hectare.',
  },
  {
    title: 'RAG Retriever',
    detail: 'ChromaDB retrieves relevant agronomy knowledge for the farm state.',
  },
  {
    title: 'LLM Advisor',
    detail: 'Groq Llama reasons over model output plus retrieved context.',
  },
  {
    title: 'Report Formatter',
    detail: 'The response is normalized into structured advisory JSON.',
  },
];

export const regionOptions = [
  {
    label: 'North',
    value: 'North',
    caption: 'Cooler grain belts',
    gradient: 'from-emerald-400/20 to-sky-300/10',
  },
  {
    label: 'South',
    value: 'South',
    caption: 'Warm cash-crop zones',
    gradient: 'from-lime-400/20 to-orange-300/10',
  },
  {
    label: 'East',
    value: 'East',
    caption: 'Monsoon-rich fields',
    gradient: 'from-teal-300/20 to-blue-400/10',
  },
  {
    label: 'West',
    value: 'West',
    caption: 'Dryland resilience',
    gradient: 'from-amber-300/20 to-lime-300/10',
  },
];

export const cropOptions = [
  { label: 'Wheat', value: 'Wheat', icon: Wheat, tone: 'from-amber-200/25 to-lime-200/10' },
  { label: 'Rice', value: 'Rice', icon: Sprout, tone: 'from-emerald-200/25 to-cyan-200/10' },
  { label: 'Cotton', value: 'Cotton', icon: Leaf, tone: 'from-stone-100/25 to-green-200/10' },
  { label: 'Corn', value: 'Maize', icon: Sprout, tone: 'from-yellow-200/25 to-lime-300/10' },
  { label: 'Barley', value: 'Barley', icon: Wheat, tone: 'from-orange-200/20 to-emerald-300/10' },
  { label: 'Soybean', value: 'Soybean', icon: Leaf, tone: 'from-lime-200/25 to-emerald-300/10' },
];

export const soilOptions = [
  { label: 'Sandy', value: 'Sandy' },
  { label: 'Clay', value: 'Clay' },
  { label: 'Loamy', value: 'Loam' },
];

export const weatherOptions = [
  { label: 'Sunny', value: 'Sunny', icon: Sun },
  { label: 'Rainy', value: 'Rainy', icon: CloudRain },
  { label: 'Cloudy', value: 'Cloudy', icon: Cloud },
];

export const samplePresets = [
  {
    label: 'Wheat in North Sandy Soil',
    values: {
      Region: 'North',
      Soil_Type: 'Sandy',
      Crop: 'Wheat',
      Weather_Condition: 'Sunny',
      Rainfall_mm: 450,
      Temperature_Celsius: 27,
      Days_to_Harvest: 100,
      Fertilizer_Used: true,
      Irrigation_Used: true,
      Pesticide_Used: false,
    },
  },
  {
    label: 'Rice in East Clay Field',
    values: {
      Region: 'East',
      Soil_Type: 'Clay',
      Crop: 'Rice',
      Weather_Condition: 'Rainy',
      Rainfall_mm: 780,
      Temperature_Celsius: 30,
      Days_to_Harvest: 125,
      Fertilizer_Used: true,
      Irrigation_Used: true,
      Pesticide_Used: true,
    },
  },
  {
    label: 'Cotton in South Sandy Field',
    values: {
      Region: 'South',
      Soil_Type: 'Sandy',
      Crop: 'Cotton',
      Weather_Condition: 'Cloudy',
      Rainfall_mm: 390,
      Temperature_Celsius: 33,
      Days_to_Harvest: 145,
      Fertilizer_Used: true,
      Irrigation_Used: false,
      Pesticide_Used: true,
    },
  },
];

export const defaultValues = samplePresets[0].values;

export const tickerItems = [
  'Validated GenAI pipeline',
  '6 core crops supported',
  '5-step AI workflow',
  'RAG-grounded results',
  'LangGraph orchestration',
  'Groq Llama reasoning',
];

export const howItWorks = [
  {
    icon: MapPinned,
    title: 'Capture field context',
    description: 'Region, crop, soil, weather, and farm practices become structured model inputs.',
  },
  {
    icon: BarChart3,
    title: 'Predict expected yield',
    description: 'A trained crop-yield model estimates tons per hectare for the selected conditions.',
  },
  {
    icon: Workflow,
    title: 'Retrieve agronomy evidence',
    description: 'The RAG layer pulls relevant crop, soil, weather, and risk guidance from the knowledge base.',
  },
  {
    icon: BrainCircuit,
    title: 'Reason with an agent',
    description: 'LangGraph coordinates prediction, retrieval, LLM reasoning, and structured report generation.',
  },
  {
    icon: CheckCircle2,
    title: 'Deliver field actions',
    description: 'Farmers receive prioritized actions, citations, risk level, and a safety note.',
  },
];

export const featureCards = [
  {
    icon: BarChart3,
    title: 'Yield Prediction',
    description: 'Turns field conditions into an expected yield estimate using the Milestone 1 model.',
  },
  {
    icon: Droplets,
    title: 'RAG Grounding',
    description: 'References agronomy rules instead of letting the LLM answer from memory alone.',
  },
  {
    icon: BrainCircuit,
    title: 'LLM Reasoning',
    description: 'Groq Llama translates model signals and retrieved context into practical decisions.',
  },
  {
    icon: FileJson,
    title: 'Structured Output',
    description: 'Produces crop summary, field status, recommendations, citations, and safety note.',
  },
  {
    icon: Leaf,
    title: 'Multi-crop Support',
    description: 'Supports wheat, rice, cotton, corn, barley, and soybean scenarios.',
  },
  {
    icon: ShieldAlert,
    title: 'Safety Flagging',
    description: 'Separates recommendations from the professional agronomist disclaimer.',
  },
];

export const riskConfig = {
  Low: { color: '#aaff45', score: 82, label: 'Low Risk' },
  Medium: { color: '#ffbf47', score: 56, label: 'Medium Risk' },
  High: { color: '#ff5c5c', score: 28, label: 'High Risk' },
  Unknown: { color: '#f5f0e8', score: 40, label: 'Unknown' },
};

export const statCards = [
  { label: 'Backend', value: 'Render API', icon: Zap },
  { label: 'Vector DB', value: 'ChromaDB', icon: Workflow },
  { label: 'Model', value: 'Llama 3.1', icon: BrainCircuit },
];

