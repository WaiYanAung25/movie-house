import { createAppError, ErrorCode } from './app-error.model';

describe('createAppError', () => {
  it('should create network error when no status code', () => {
    const error = createAppError(undefined);
    expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(error.retryable).toBeTrue();
    expect(error.message).toContain('Network error');
  });

  it('should create unauthorized error for 401', () => {
    const error = createAppError(401);
    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(error.retryable).toBeFalse();
    expect(error.statusCode).toBe(401);
  });

  it('should create unauthorized error for 403', () => {
    const error = createAppError(403);
    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(error.retryable).toBeFalse();
  });

  it('should create not found error for 404', () => {
    const error = createAppError(404);
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
    expect(error.retryable).toBeFalse();
  });

  it('should create rate limited error for 429', () => {
    const error = createAppError(429);
    expect(error.code).toBe(ErrorCode.RATE_LIMITED);
    expect(error.retryable).toBeTrue();
  });

  it('should create server error for 500', () => {
    const error = createAppError(500);
    expect(error.code).toBe(ErrorCode.SERVER_ERROR);
    expect(error.retryable).toBeTrue();
  });

  it('should create server error for 503', () => {
    const error = createAppError(503);
    expect(error.code).toBe(ErrorCode.SERVER_ERROR);
    expect(error.retryable).toBeTrue();
  });

  it('should create unknown error for other codes', () => {
    const error = createAppError(418);
    expect(error.code).toBe(ErrorCode.UNKNOWN);
    expect(error.retryable).toBeTrue();
  });
});
