/**
 * GitHub API Utility Functions
 *
 * Helper functions for working with GitHub API data
 */

/**
 * Validate GitHub username format
 */
export const isValidGitHubUsername = (username: string): boolean => {
  // GitHub username rules:
  // - May only contain alphanumeric characters or single hyphens
  // - Cannot begin or end with a hyphen
  // - Maximum 39 characters
  const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return usernameRegex.test(username);
};
