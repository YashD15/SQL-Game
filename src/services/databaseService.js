// services/databaseService.js

/**
 * Execute SQL query using your existing executeQuery function
 * This is a wrapper service to handle the API communication
 */
export const executeSQLQuery = async (query) => {
  try {
    const response = await fetch('/api/execute-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: `Network Error: ${error.message}`,
      data: []
    };
  }
};

// Alternative direct import version (if not using API routes)
// import { executeQuery } from '../lib/database';
// 
// export const executeSQLQuery = async (query) => {
//   try {
//     return executeQuery(query);
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message,
//       data: []
//     };
//   }
// };