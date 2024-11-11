export class ApiError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
  }
}

export class CinodeError extends ApiError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'CinodeError';
  }
}
