import { BarChart3, BookOpen, History, Home, ImagePlus, Microscope } from 'lucide-react';
import type { Page } from '../types/app';

export const routePathByPage: Record<Page, string> = {
  landing: '/',
  scan: '/scan',
  result: '/result',
  history: '/history',
  model: '/model',
  guide: '/guide',
};

export const pageByRoutePath = Object.fromEntries(
  Object.entries(routePathByPage).map(([page, path]) => [path, page]),
) as Record<string, Page>;

export const navigation = [
  { id: 'landing', label: 'Overview', icon: Home },
  { id: 'scan', label: 'Scan', icon: ImagePlus },
  { id: 'result', label: 'Result', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
  { id: 'model', label: 'Model', icon: Microscope },
  { id: 'guide', label: 'Guide', icon: BookOpen },
] as const;

export const getPageFromHash = (): Page => {
  const rawPath = window.location.hash.replace(/^#/, '') || '/';
  return pageByRoutePath[rawPath] || 'landing';
};

export const getRouteHref = (page: Page) => `#${routePathByPage[page]}`;
