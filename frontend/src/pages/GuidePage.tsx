import { CheckCircle2 } from 'lucide-react';
import goodPhoto from '../assets/good-photo.jpg';
import badPhoto from '../assets/bad-photo.jpg';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import type { Page } from '../types/app';
import './GuidePage.css';

interface GuidePageProps {
  navigate: (page: Page) => void;
}

export function GuidePage({ navigate }: GuidePageProps) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Image capture guide"
        title="Usage guide"
        copy="Use consistent images to make the binary prediction more reliable."
      />

      <div className="guide-examples">
        <Card className="example-card example-good">
          <img src={goodPhoto} alt="Good photo example" className="example-good-photo" />
          <h2>Good photo examples</h2>
          <p>Single leaf, visible surface, steady framing, even light.</p>
        </Card>
        <Card className="example-card example-bad">
          <img src={badPhoto} alt="Bad photo example" className="example-bad-photo" />
          <h2>Bad photo examples</h2>
          <p>Blurred, too dark, crowded background, or leaf partly hidden.</p>
        </Card>
      </div>

      <Card>
        <h2>Step-by-step</h2>
        <div className="step-grid">
          <div><span>1</span><strong>Upload tomato leaf image</strong><p>Use a JPG or PNG image.</p></div>
          <div><span>2</span><strong>Wait for model prediction</strong><p>The frontend sends the image to the prediction API.</p></div>
          <div><span>3</span><strong>Review binary result</strong><p>Read Healthy or Unhealthy and confidence.</p></div>
          <div><span>4</span><strong>Save or scan another</strong><p>Use history for session review.</p></div>
        </div>
      </Card>

      <Card tone="soft">
        <h2>Tips for better scan accuracy</h2>
        <ul className="check-list">
          <li><CheckCircle2 size={17} /> Photograph one tomato leaf at a time</li>
          <li><CheckCircle2 size={17} /> Keep the camera steady</li>
          <li><CheckCircle2 size={17} /> Avoid strong shadows or reflections</li>
          <li><CheckCircle2 size={17} /> Crop out unrelated objects when possible</li>
        </ul>
      </Card>

      <Button onClick={() => navigate('scan')}>Start Scan</Button>
    </div>
  );
}
