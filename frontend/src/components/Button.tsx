import type { ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export function Button({ children, variant = 'primary', disabled, onClick, type = 'button' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
