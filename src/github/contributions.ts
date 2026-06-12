import 'server-only';

/**
 * GitHub Calendar Contributions API
 *
 * Functions to retrieve user contribution calendar data
 */

import { createGitHubClient } from './client';
import {
  ContributionCalendarResponse,
  ContributionQueryParams,
  DateRange,
  ContributionCalendarResult,
} from './types';
import { isValidGitHubUsername } from './utils';

/**
 * GraphQL query for contribution calendar
 */
const CONTRIBUTION_CALENDAR_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      name
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
              contributionLevel
            }
            firstDay
          }
        }
      }
    }
  }
`;

/**
 * Calculate date range for the last 12 months
 */
const getLast12MonthsRange = (): DateRange => {
  const to = new Date();
  // End at the latest second of the current day to capture today fully
  to.setHours(23, 59, 59, 999);
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);
  // Align start to the earliest moment of the day
  from.setHours(0, 0, 0, 0);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
};

/**
 * Calculate date range for a specific year
 */
const getYearRange = (year: number): DateRange => {
  const from = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
};

/**
 * Calculate date range from custom dates
 */
const getCustomRange = (from: string, to: string): DateRange => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new Error('Invalid date format. Use ISO 8601 format (YYYY-MM-DD or full ISO).');
  }

  if (fromDate > toDate) {
    throw new Error('From date must be before to date');
  }

  // Normalize to start-of-day and end-of-day to include full range
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  };
};

/**
 * Get contribution calendar data for a user
 */
const getContributionCalendar = async (
  params: ContributionQueryParams,
): Promise<ContributionCalendarResult> => {
  const { username, year } = params;

  if (!username) {
    throw new Error('Username is required');
  }

  if (!isValidGitHubUsername(username)) {
    throw new Error('Invalid GitHub username');
  }

  let dateRange: DateRange;

  // Determine date range based on parameters
  if (year) {
    dateRange = getYearRange(year);
  } else {
    dateRange = getLast12MonthsRange();
  }

  try {
    const client = createGitHubClient();

    const response = await client.query<ContributionCalendarResponse>(
      CONTRIBUTION_CALENDAR_QUERY,
      {
        username,
        from: dateRange.from,
        to: dateRange.to,
      },
      { timeoutMs: 15000 },
    );

    if (!response.data?.user) {
      throw new Error(`User '${username}' not found`);
    }

    return {
      username,
      name: response.data.user.name,
      dateRange,
      calendar: response.data.user.contributionsCollection.contributionCalendar,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch contribution calendar: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching contribution calendar');
  }
};

/**
 * Get contribution calendar for the last 12 months
 */
export const getLast12MonthsContributions = async (username: string) => {
  return getContributionCalendar({ username });
};

/**
 * Get contribution calendar for a specific year
 */
export const getYearContributions = async (username: string, year: number) => {
  const currentYear = new Date().getFullYear();

  if (year < 2008 || year > currentYear) {
    throw new Error(`Year must be between 2008 and ${currentYear}`);
  }

  return getContributionCalendar({ username, year });
};
