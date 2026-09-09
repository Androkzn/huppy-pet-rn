/**
 * GraphQL client configuration
 */

import { GraphQLClient } from 'graphql-request';
import { getAccessToken, refreshAccessToken } from '@services/auth/authService';

// Get GraphQL endpoint from environment
const GRAPHQL_ENDPOINT = process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || '';

if (!GRAPHQL_ENDPOINT) {
  console.warn('GRAPHQL_ENDPOINT not found in environment variables');
}

/**
 * Create GraphQL client with authentication
 */
export const createGraphQLClient = async (): Promise<GraphQLClient> => {
  const token = await getAccessToken();

  const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return client;
};

/**
 * Execute GraphQL query with automatic token refresh
 */
export const executeQuery = async <T>(
  query: string,
  variables?: any
): Promise<T> => {
  try {
    const client = await createGraphQLClient();
    return await client.request<T>(query, variables);
  } catch (error: any) {
    // Handle invalid session error
    if (error?.response?.errors?.[0]?.message === 'InvalidSession') {
      // Try to refresh token and retry
      const token = await refreshAccessToken();
      if (token) {
        const client = await createGraphQLClient();
        return await client.request<T>(query, variables);
      }
    }
    throw error;
  }
};

/**
 * Execute GraphQL mutation with automatic token refresh
 */
export const executeMutation = async <T>(
  mutation: string,
  variables?: any
): Promise<T> => {
  return executeQuery<T>(mutation, variables);
};

/**
 * Batch execute multiple queries
 */
export const executeBatch = async <T>(
  queries: Array<{ query: string; variables?: any }>
): Promise<T[]> => {
  const client = await createGraphQLClient();

  const promises = queries.map(({ query, variables }) =>
    client.request<T>(query, variables)
  );

  return await Promise.all(promises);
};
