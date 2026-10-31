import { formatPercent } from '../utils/prediction';
import './ConfidenceBar.css';

interface ConfidenceBarProps {
  label: string;
  value: number;
  tone?: 'healthy' | 'unhealthy' | 'neutral';
}

export function ConfidenceBar({ label, value, tone = 'healthy' }: ConfidenceBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="confidence-row">
      <div className="confidence-label">
        <span>{label}</span>
        <strong>{formatPercent(safeValue)}</strong>
      </div>
      <div className="progress-track" aria-label={`${label} ${formatPercent(safeValue)}`}>
        <span className={`progress-fill progress-${tone}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
