import 'server-only';

/**
 * GitHub GraphQL API Client
 *
 * Core client for making GraphQL requests to GitHub's API
 */

import { GitHubAPIConfig, GraphQLResponse } from './types';
import siteConfig from '@/config/site';

class GitHubGraphQLError extends Error {
  public readonly errors: Array<{ message: string; type?: string; path?: (string | number)[] }>;
  constructor(
    message: string,
    errors: Array<{ message: string; type?: string; path?: (string | number)[] }>,
  ) {
    super(message);
    this.name = 'GitHubGraphQLError';
    this.errors = errors;
  }
}

class GitHubGraphQLClient {
  private readonly endpoint: string;
  private readonly token: string;

  constructor(config: GitHubAPIConfig) {
    this.endpoint = config.endpoint || 'https://api.github.com/graphql';
    this.token = config.token;
  }

  /**
   * Execute a GraphQL query
   */
  async query<T>(
    query: string,
    variables?: Record<string, unknown>,
    options?: { timeoutMs?: number },
  ): Promise<GraphQLResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options?.timeoutMs ?? 15000);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent': siteConfig.userAgent,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new GitHubGraphQLError(
          `GraphQL Error: ${result.errors.map((e) => e.message).join(', ')}`,
          result.errors.map((err) => ({
            message: err.message,
            type: (err as Partial<{ type: string }>).type,
            path: err.path as (string | number)[] | undefined,
          })),
        );
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unknown error occurred: ${String(error)}`);
    }
  }

  /**
   * Validate the API token by making a simple query
   */
  async validateToken(): Promise<boolean> {
    try {
      const query = `
        query {
          viewer {
            login
          }
        }
      `;

      const result = await this.query(query);
      return !!result.data;
    } catch {
      return false;
    }
  }
}

/**
 * Create a GitHub GraphQL client instance
 */
export const createGitHubClient = (): GitHubGraphQLClient => {
  const token = process.env.GITHUB_ACCESS_TOKEN;

  if (!token) {
    throw new Error('GITHUB_ACCESS_TOKEN environment variable is required');
  }

  return new GitHubGraphQLClient({ token });
};
