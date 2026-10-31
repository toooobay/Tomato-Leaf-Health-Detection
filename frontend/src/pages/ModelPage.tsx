import { AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import './ModelPage.css';

export function ModelPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Technical summary"
        title="Model information"
        copy="Readable documentation for the actual frontend/backend prediction behavior."
      />

      <div className="two-column">
        <Card>
          <h2>Project overview</h2>
          <p>This application checks a tomato leaf image and returns a binary health class: Healthy or Unhealthy.</p>
        </Card>
        <Card>
          <h2>Binary classification</h2>
          <p>The model does not identify exact disease type. It only separates the image into two output classes.</p>
        </Card>
      </div>

      <Card>
        <h2>Preprocessing pipeline</h2>
        <div className="step-grid">
          <div><span>1</span><strong>Resize image</strong><p>Image is resized to 128x128 in the backend.</p></div>
          <div><span>2</span><strong>Enhance contrast</strong><p>CLAHE is applied before feature extraction.</p></div>
          <div><span>3</span><strong>Extract features</strong><p>HOG texture and HSV color histogram features are created.</p></div>
          <div><span>4</span><strong>Predict class</strong><p>The scaled feature vector is passed to a binary classifier.</p></div>
        </div>
      </Card>

      <div className="two-column">
        <Card>
          <h2>Dataset section</h2>
          <p>Dataset source, count, train/test split, and validation notes should be documented here when finalized.</p>
        </Card>
        <Card>
          <h2>Architecture placeholder</h2>
          <p>The current backend uses a feature-based binary classifier. Add CNN architecture notes only if the deployed model is changed.</p>
        </Card>
      </div>

      <Card tone="soft">
        <h2>Limitations</h2>
        <ul className="check-list warning-list">
          <li><AlertCircle size={17} /> Cannot identify exact disease type</li>
          <li><AlertCircle size={17} /> Image quality affects prediction</li>
          <li><AlertCircle size={17} /> Should not replace expert inspection</li>
        </ul>
      </Card>
    </div>
  );
}
