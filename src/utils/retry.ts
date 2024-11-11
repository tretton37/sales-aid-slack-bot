import { Defaults } from './constants.js';
import logger from './logger.js';
import { CinodeError } from './errors.js';

const isForbiddenError = (error: unknown): boolean => {
  return error instanceof CinodeError && error.statusCode === 403;
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 5,
  delay = Defaults.RETRY_DURATION
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      logger.error(`Attempt ${attempt}/${retries} failed`, error);

      if (isForbiddenError(error) || attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, delay);
        timeout.unref?.();
      });
    }
  }
  throw new Error('Retry operation failed');
}
