import type { ReactNode } from 'react';
import logo from '../assets/logo.png';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { getRouteHref, navigation } from '../routes/routes';
import type { Page } from '../types/app';
import './AppShell.css';

interface AppShellProps {
  activePage: Page;
  children: ReactNode;
}

export function AppShell({ activePage, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <a className="brand-lockup" href={getRouteHref('landing')}>
          <span className="brand-mark"><img src={logo} alt="Tomato Leaf" className="brand-logo" /></span>
          <div>
            <strong>Tomato Leaf</strong>
            <span>Health Detection</span>
          </div>
        </a>
        <nav className="nav-list">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'is-active' : ''}`}
                href={getRouteHref(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <Card className="sidebar-note" tone="soft">
          <Badge tone="info">Binary model</Badge>
          <p>Outputs only Healthy or Unhealthy. No disease type or treatment advice is inferred.</p>
        </Card>
      </aside>

      <main className="main-surface">{children}</main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.id} className={activePage === item.id ? 'is-active' : ''} href={getRouteHref(item.id)}>
              <Icon size={18} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
