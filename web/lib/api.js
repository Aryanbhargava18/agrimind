import axios from 'axios';

import { API_BASE_URL } from './constants';
import { toApiPayload } from './schema';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 130000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getBackendHealth() {
  try {
    const response = await api.get('/', { timeout: 10000 });
    return {
      ok: response.status >= 200 && response.status < 300,
      message: response.data?.message || 'Backend online',
    };
  } catch (error) {
    return {
      ok: false,
      message: normalizeError(error),
    };
  }
}

export async function requestAdvisory(values) {
  try {
    const payload = toApiPayload(values);
    const response = await api.post('/predict', payload);
    return normalizeAdvisoryResponse(response.data, payload);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

function normalizeAdvisoryResponse(data, payload) {
  const cropSummary = data?.crop_summary || {};
  const fieldStatus = data?.field_status || {};
  const actions = Array.isArray(data?.recommended_actions) ? data.recommended_actions : [];
  const references = Array.isArray(data?.agronomic_references) ? data.agronomic_references : [];

  return {
    payload,
    raw: data,
    cropSummary: {
      cropName: text(cropSummary.crop_name, payload.Crop),
      region: text(cropSummary.region, payload.Region),
      yieldPrediction: text(cropSummary.yield_prediction, 'N/A'),
      yieldCategory: text(cropSummary.yield_category, data?.yield_risk_level || 'Unknown'),
    },
    fieldStatus: {
      soilType: text(fieldStatus.soil_type, payload.Soil_Type),
      rainfallMm: fieldStatus.rainfall_mm ?? payload.Rainfall_mm,
      temperature: text(fieldStatus.temperature, `${payload.Temperature_Celsius} C`),
      irrigation: fieldStatus.irrigation ?? payload.Irrigation_Used,
      fertilizer: fieldStatus.fertilizer ?? payload.Fertilizer_Used,
      weather: text(fieldStatus.weather, payload.Weather_Condition),
    },
    riskLevel: text(data?.yield_risk_level, cropSummary.yield_category || 'Unknown'),
    recommendedActions: actions.map((action, index) => ({
      task: text(action?.task, `Action ${index + 1}`),
      description: text(action?.description, String(action || 'Review field conditions.')),
    })),
    agronomicReferences: references.map((reference) => String(reference)),
    safetyDisclaimer: text(
      data?.safety_disclaimer,
      'Consult a certified local agronomist before implementing recommendations.',
    ),
    receivedAt: new Date().toISOString(),
  };
}

export function parseYieldValue(value) {
  const match = String(value).match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function normalizeError(error) {
  if (error.code === 'ECONNABORTED') {
    return 'The backend took longer than expected. Render may be waking up; retry in a moment.';
  }
  if (error.response?.status === 422) {
    return 'The backend rejected one or more farm inputs. Review the form and try again.';
  }
  if (error.response?.status >= 500) {
    return 'The backend hit a server error while running the advisory pipeline.';
  }
  if (error.message?.includes('Network Error')) {
    return 'The advisory backend is unreachable from the browser. Use the Vite/Vercel /api proxy or enable CORS on the backend.';
  }
  return error.response?.data?.detail || error.message || 'The advisory request failed.';
}

function text(value, fallback) {
  if (value === null || value === undefined) return fallback;
  const normalized = String(value).trim();
  return normalized || fallback;
}
