import './PageHeader.css';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  copy?: string;
}

export function PageHeader({ eyebrow, title, copy }: PageHeaderProps) {
  return (
    <header className="page-header">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <div>
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
    </header>
  );
}
