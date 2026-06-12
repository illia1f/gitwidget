'use client';

import { cn } from '@/lib/utils';
import { createContext, PropsWithChildren, use, useCallback, useState } from 'react';

export interface BuilderConfig {
  username: string;
  theme: 'light' | 'dark';
  year?: number;
  showMonthLabels: boolean;
  showWeekdayLabels: boolean;
  showLegend: boolean;
  showBorder: boolean;
  hideTitle: boolean;
  enableAnimations: boolean;
  title?: string;
  cellSize?: number;
  borderWidth?: number;
  borderRadius?: number;
}

interface BuilderContextType {
  config: BuilderConfig;
  updateConfig: (updates: Partial<BuilderConfig>) => void;
  generateURL: () => string;
  generateMarkdown: () => string;
  generateHTML: () => string;
}

const defaultConfig: BuilderConfig = {
  username: '',
  theme: 'dark',
  showMonthLabels: true,
  showWeekdayLabels: true,
  showLegend: true,
  showBorder: false,
  hideTitle: false,
  enableAnimations: true,
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

interface RootProps extends PropsWithChildren {
  className?: string;
}

export const Root = ({ className, children }: RootProps) => {
  const [config, setConfig] = useState<BuilderConfig>(defaultConfig);

  const updateConfig = useCallback((updates: Partial<BuilderConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const generateURL = useCallback(() => {
    if (!config.username) return '';

    const params = new URLSearchParams();
    params.set('username', config.username);
    params.set('theme', config.theme);

    if (config.year) params.set('year', config.year.toString());

    params.set('show_month_labels', config.showMonthLabels.toString());
    params.set('show_weekday_labels', config.showWeekdayLabels.toString());
    params.set('show_legend', config.showLegend.toString());
    params.set('show_border', config.showBorder.toString());
    params.set('hide_title', config.hideTitle.toString());
    params.set('enable_animations', config.enableAnimations.toString());

    if (config.title) params.set('title', config.title);
    if (config.cellSize) params.set('cell_size', config.cellSize.toString());
    if (config.borderWidth) params.set('border_width', config.borderWidth.toString());
    if (config.borderRadius) params.set('border_radius', config.borderRadius.toString());

    // Add cache busting parameter based on animation state to force refresh
    // This ensures the browser fetches fresh SVG content when animation settings toggle
    const animationCacheKey = config.enableAnimations ? 'anim' : 'static';
    params.set('_refresh', animationCacheKey);

    return `${window.location.origin}/api/contributions?${params.toString()}`;
  }, [config]);

  const generateMarkdown = useCallback(() => {
    const url = generateURL();
    if (!url) return '';

    return `![${config.username}'s GitHub Contributions](${url})`;
  }, [config, generateURL]);

  const generateHTML = useCallback(() => {
    const url = generateURL();
    if (!url) return '';

    return `<img src="${url}" alt="${config.username}'s GitHub Contributions" />`;
  }, [config, generateURL]);

  const value: BuilderContextType = {
    config,
    updateConfig,
    generateURL,
    generateMarkdown,
    generateHTML,
  };

  return (
    <BuilderContext.Provider value={value}>
      <div className={cn('flex flex-col lg:flex-row', className)}>{children}</div>
    </BuilderContext.Provider>
  );
};

export const useBuilderContext = () => {
  const context = use(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilderContext must be used within a BuilderProvider');
  }
  return context;
};
