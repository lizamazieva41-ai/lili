/**
 * Error handling utilities for TypeScript strict mode
 */

/**
 * Type guard for Error instances
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Get error message safely from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return (error as Error).message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Unknown error occurred';
}

/**
 * Get error stack safely from unknown error type
 */
export function getErrorStack(error: unknown): string | undefined {
  if (isError(error)) {
    return error.stack;
  }
  return undefined;
}

/**
 * Wrap unknown error into Error instance
 */
export function toError(error: unknown): Error {
  if (isError(error)) {
    return error;
  }
  return new Error(getErrorMessage(error));
}

/**
 * Assert that a value is defined (not null or undefined)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value is required but was null or undefined',
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

/**
 * Type-safe object property checker
 */
export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> {
  return obj != null && typeof obj === 'object' && key in obj;
}
