import { z } from 'zod';

export const advisorySchema = z.object({
  Region: z.enum(['North', 'South', 'East', 'West'], {
    message: 'Choose a region.',
  }),
  Soil_Type: z.enum(['Sandy', 'Clay', 'Loam'], {
    message: 'Choose a supported soil type.',
  }),
  Crop: z.enum(['Wheat', 'Rice', 'Cotton', 'Maize', 'Barley', 'Soybean'], {
    message: 'Choose a supported crop.',
  }),
  Weather_Condition: z.enum(['Sunny', 'Rainy', 'Cloudy'], {
    message: 'Choose a weather condition.',
  }),
  Rainfall_mm: z.coerce
    .number()
    .min(0, 'Rainfall cannot be negative.')
    .max(1000, 'Rainfall must be 1000mm or less.'),
  Temperature_Celsius: z.coerce
    .number()
    .min(-10, 'Temperature is below the supported range.')
    .max(60, 'Temperature is above the supported range.'),
  Days_to_Harvest: z.coerce
    .number()
    .int('Days to harvest must be a whole number.')
    .min(1, 'Minimum is 1 day.')
    .max(365, 'Maximum is 365 days.'),
  Fertilizer_Used: z.boolean(),
  Irrigation_Used: z.boolean(),
  Pesticide_Used: z.boolean().optional(),
});

export const stepFields = {
  0: ['Region', 'Crop', 'Soil_Type'],
  1: ['Weather_Condition', 'Rainfall_mm', 'Temperature_Celsius', 'Days_to_Harvest'],
  2: ['Fertilizer_Used', 'Irrigation_Used', 'Pesticide_Used'],
  3: [
    'Region',
    'Crop',
    'Soil_Type',
    'Weather_Condition',
    'Rainfall_mm',
    'Temperature_Celsius',
    'Days_to_Harvest',
    'Fertilizer_Used',
    'Irrigation_Used',
  ],
};

export function toApiPayload(values) {
  return {
    Region: values.Region,
    Soil_Type: values.Soil_Type,
    Crop: values.Crop,
    Rainfall_mm: Number(values.Rainfall_mm),
    Temperature_Celsius: Number(values.Temperature_Celsius),
    Fertilizer_Used: Boolean(values.Fertilizer_Used),
    Irrigation_Used: Boolean(values.Irrigation_Used),
    Weather_Condition: values.Weather_Condition,
    Days_to_Harvest: Number(values.Days_to_Harvest),
  };
}

