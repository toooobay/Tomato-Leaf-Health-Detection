export type Page = 'landing' | 'scan' | 'result' | 'history' | 'model' | 'guide';

export interface PredictionResult {
  prediction: 'Healthy' | 'Unhealthy' | string;
  prediction_code: number;
  confidence: number;
  confidence_percentage: number;
}

export interface ScanRecord {
  id: string;
  date: string;
  prediction: string;
  confidence: number;
  preview: string;
  fileName: string;
  inferenceTimeMs?: number;
}
