import { BarChart3, Leaf, RefreshCw, ShieldAlert } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import type { Page, PredictionResult } from '../types/app';
import { formatPercent } from '../utils/prediction';
import './ResultPage.css';

interface ResultPageProps {
  preview: string | null;
  result: PredictionResult | null;
  probability: { healthy: number; unhealthy: number };
  inferenceTimeMs: number | null;
  navigate: (page: Page) => void;
  removeFile: () => void;
}

export function ResultPage({ preview, result, probability, inferenceTimeMs, navigate, removeFile }: ResultPageProps) {
  if (!result) {
    return (
      <EmptyState
        icon={<BarChart3 size={42} />}
        title="No result yet"
        copy="Upload and analyze a tomato leaf image to generate a binary health prediction."
        action={<Button onClick={() => navigate('scan')}>Start Scan</Button>}
      />
    );
  }

  const isHealthy = result.prediction === 'Healthy';

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Result detail"
        title="Leaf inspection result"
        copy="Review the uploaded image, model confidence, and metadata from the latest inference."
      />

      <div className="result-layout">
        <Card className="image-result-card">
          {preview ? (
            <img src={preview} alt="Uploaded tomato leaf result preview" />
          ) : (
            <div className="leaf-placeholder"><Leaf size={72} /><span>No image preview</span></div>
          )}
        </Card>

        <div className="result-column">
          <Card className="prediction-card" tone={isHealthy ? 'success' : 'warning'}>
            <div className="panel-topline">
              <span>Prediction</span>
              <Badge tone={isHealthy ? 'healthy' : 'unhealthy'}>{result.prediction}</Badge>
            </div>
            <strong className="result-number">{formatPercent(result.confidence_percentage)}</strong>
            <p>Confidence for the predicted class.</p>
            <ConfidenceBar label="Healthy probability" value={probability.healthy} tone="healthy" />
            <ConfidenceBar label="Unhealthy probability" value={probability.unhealthy} tone="unhealthy" />
          </Card>

          <Card>
            <h2>Model output</h2>
            <div className="metadata-grid">
              <span>Model type</span><strong>SVM binary classifier</strong>
              <span>Input resize</span><strong>128x128</strong>
              <span>Features</span><strong>HOG texture + HSV color</strong>
              <span>Output classes</span><strong>Healthy, Unhealthy</strong>
              <span>Inference time</span><strong>{inferenceTimeMs ? `${inferenceTimeMs} ms` : 'Not available'}</strong>
            </div>
          </Card>

          <Card tone="soft">
            <div className="notice">
              <ShieldAlert size={19} />
              <p>This result is an AI prediction and should not be treated as a final agricultural diagnosis.</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="button-row">
        <Button onClick={() => navigate('scan')}>
          <RefreshCw size={17} /> Scan another image
        </Button>
        <Button variant="secondary" onClick={removeFile}>
          Clear current scan
        </Button>
      </div>
    </div>
  );
}
