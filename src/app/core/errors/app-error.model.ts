export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  statusCode?: number;
}

export function createAppError(statusCode?: number, rawError?: unknown): AppError {
  if (statusCode === undefined) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: 'Network error. Please check your connection and try again.',
      retryable: true,
    };
  }

  switch (statusCode) {
    case 401:
    case 403:
      return {
        code: ErrorCode.UNAUTHORIZED,
        message: 'Invalid API key. Please check your TMDB configuration.',
        retryable: false,
        statusCode,
      };
    case 404:
      return {
        code: ErrorCode.NOT_FOUND,
        message: 'The requested resource was not found.',
        retryable: false,
        statusCode,
      };
    case 429:
      return {
        code: ErrorCode.RATE_LIMITED,
        message: 'Too many requests. Please wait a moment and try again.',
        retryable: true,
        statusCode,
      };
    default:
      if (statusCode >= 500) {
        return {
          code: ErrorCode.SERVER_ERROR,
          message: 'Server error. Please try again later.',
          retryable: true,
          statusCode,
        };
      }
      return {
        code: ErrorCode.UNKNOWN,
        message: 'An unexpected error occurred.',
        retryable: true,
        statusCode,
      };
  }
}
