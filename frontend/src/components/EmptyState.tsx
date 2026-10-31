import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  copy: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, copy, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon}
      <h1>{title}</h1>
      <p>{copy}</p>
      {action}
    </div>
  );
}
