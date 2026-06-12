/**
 * GitHub GraphQL API Module
 *
 * Main entry point for GitHub API functionality
 */

// Export all types
export * from './types';

// Export client
export { createGitHubClient } from './client';

// Export contribution functions
export { getLast12MonthsContributions, getYearContributions } from './contributions';
