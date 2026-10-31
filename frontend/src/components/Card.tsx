import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'soft' | 'success' | 'warning';
}

export function Card({ children, className = '', tone = 'default' }: CardProps) {
  return <section className={`card card-${tone} ${className}`}>{children}</section>;
}
