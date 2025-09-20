// utils/gameValidation.js

/**
 * Strictly validates query result against expected output
 * Checks both structure and content with exact matching
 */
export const validateQueryResult = (questionId, result, expectedOutput) => {
  if (!result || !expectedOutput) return false;

  // Check if result is an array
  if (!Array.isArray(result)) return false;

  // Check exact length match
  if (result.length !== expectedOutput.length) return false;

  // If empty arrays, both must be empty
  if (result.length === 0 && expectedOutput.length === 0) return true;

  // Check each row
  for (let i = 0; i < result.length; i++) {
    const actualRow = result[i];
    const expectedRow = expectedOutput[i];

    // Check if both are objects
    if (typeof actualRow !== 'object' || typeof expectedRow !== 'object') return false;
    if (actualRow === null || expectedRow === null) return false;

    // Check exact key count
    const actualKeys = Object.keys(actualRow);
    const expectedKeys = Object.keys(expectedRow);
    
    if (actualKeys.length !== expectedKeys.length) return false;

    // Check each key-value pair
    for (const key of expectedKeys) {
      if (!actualRow.hasOwnProperty(key)) return false;
      
      // Strict value comparison (case-sensitive)
      if (actualRow[key] !== expectedRow[key]) return false;
    }
  }

  return true;
};

/**
 * Get detailed validation message for debugging
 */
export const getValidationMessage = (result, expectedOutput) => {
  if (!result) return "No result returned";
  if (!Array.isArray(result)) return "Result is not an array";
  
  if (result.length !== expectedOutput.length) {
    return `Expected ${expectedOutput.length} row(s), got ${result.length} row(s)`;
  }

  if (result.length === 0) return "Both result and expected are empty - this should be valid";

  // Check first row for detailed feedback
  const actualRow = result[0];
  const expectedRow = expectedOutput[0];

  if (typeof actualRow !== 'object') return "First row is not an object";
  
  const actualKeys = Object.keys(actualRow);
  const expectedKeys = Object.keys(expectedRow);
  
  if (actualKeys.length !== expectedKeys.length) {
    return `Expected ${expectedKeys.length} column(s) [${expectedKeys.join(', ')}], got ${actualKeys.length} column(s) [${actualKeys.join(', ')}]`;
  }

  for (const key of expectedKeys) {
    if (!actualRow.hasOwnProperty(key)) {
      return `Missing expected column: ${key}`;
    }
    
    if (actualRow[key] !== expectedRow[key]) {
      return `Column '${key}': expected '${expectedRow[key]}', got '${actualRow[key]}'`;
    }
  }

  return "Validation passed";
};

/**
 * Check if user has exceeded maximum attempts for a question
 */
export const hasExceededMaxAttempts = (attempts, maxAttempts) => {
  return attempts >= maxAttempts;
};

/**
 * Get attempts status message
 */
export const getAttemptsMessage = (attempts, maxAttempts) => {
  const remaining = maxAttempts - attempts;
  if (remaining <= 0) return "No attempts remaining";
  if (remaining === 1) return "1 attempt remaining";
  return `${remaining} attempts remaining`;
};