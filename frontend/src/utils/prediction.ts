import type { PredictionResult } from '../types/app';

export const formatPercent = (value: number) => `${Math.max(0, Math.min(100, value)).toFixed(1)}%`;

export const getProbabilitySplit = (result: PredictionResult | null) => {
  if (!result) return { healthy: 50, unhealthy: 50 };

  const confidence = Math.max(0, Math.min(100, Number(result.confidence_percentage) || 0));

  if (result.prediction === 'Healthy') {
    return { healthy: confidence, unhealthy: 100 - confidence };
  }

  return { healthy: 100 - confidence, unhealthy: confidence };
};
