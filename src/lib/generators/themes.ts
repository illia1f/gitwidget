/**
 * Theme definitions for SVG generators
 */

import { ContributionThemeColors, Theme } from './types';
import type { ContributionLevel } from '@/github/types';

export type { ContributionThemeColors };

const lightTheme: ContributionThemeColors = {
  background: '#ffffff',
  foreground: '#0d1117',
  muted: '#f6f8fa',
  mutedForeground: '#656d76',
  border: '#d0d7de',
  accent: '#0969da',
  primary: '#1f2328',
  secondary: '#656d76',
  success: '#1a7f37',
  warning: '#d1242f',
  error: '#cf222e',
  contributionLevels: {
    none: '#ebedf0',
    low: '#9be9a8',
    medium: '#40c463',
    high: '#30a14e',
    highest: '#216e39',
  },
};

const darkTheme: ContributionThemeColors = {
  background: '#0d1117',
  foreground: '#f0f6fc',
  muted: '#21262d',
  mutedForeground: '#8b949e',
  border: '#30363d',
  accent: '#58a6ff',
  primary: '#f0f6fc',
  secondary: '#8b949e',
  success: '#3fb950',
  warning: '#d29922',
  error: '#f85149',
  contributionLevels: {
    none: '#161b22',
    low: '#0e4429',
    medium: '#006d32',
    high: '#26a641',
    highest: '#39d353',
  },
};

export const getTheme = (theme: Theme): ContributionThemeColors => {
  return theme === 'dark' ? darkTheme : lightTheme;
};

export const getContributionLevelColor = (level: ContributionLevel, theme: Theme): string => {
  const colors = getTheme(theme).contributionLevels;

  switch (level) {
    case 'NONE':
      return colors.none;
    case 'FIRST_QUARTILE':
      return colors.low;
    case 'SECOND_QUARTILE':
      return colors.medium;
    case 'THIRD_QUARTILE':
      return colors.high;
    case 'FOURTH_QUARTILE':
      return colors.highest;
    default:
      return colors.none;
  }
};
