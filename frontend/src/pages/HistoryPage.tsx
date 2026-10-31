import { History } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import type { Page, ScanRecord } from '../types/app';
import './HistoryPage.css';

interface HistoryPageProps {
  history: ScanRecord[];
  openRecord: (record: ScanRecord) => void;
  navigate: (page: Page) => void;
}

export function HistoryPage({ history, openRecord, navigate }: HistoryPageProps) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Session log"
        title="Scan history"
        copy="Recent uploads from this browser session. No disease names or treatment suggestions are generated."
      />

      {history.length === 0 ? (
        <EmptyState
          icon={<History size={42} />}
          title="No scans recorded"
          copy="Analyze an image to populate this history view."
          action={<Button onClick={() => navigate('scan')}>Start Scan</Button>}
        />
      ) : (
        <div className="history-grid">
          {history.map((record) => (
            <Card key={record.id} className="history-card">
              <img src={record.preview} alt={`Scan thumbnail for ${record.fileName}`} />
              <div className="history-content">
                <Badge tone={record.prediction === 'Healthy' ? 'healthy' : 'unhealthy'}>{record.prediction}</Badge>
                <h3>{record.fileName}</h3>
                <p>{record.date}</p>
                <ConfidenceBar label="Confidence" value={record.confidence} tone={record.prediction === 'Healthy' ? 'healthy' : 'unhealthy'} />
                <Button variant="secondary" onClick={() => openRecord(record)}>View detail</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
