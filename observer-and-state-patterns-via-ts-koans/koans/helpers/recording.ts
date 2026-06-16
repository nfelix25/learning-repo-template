import type { ObservableObserver } from "../../src/observable/observable.ts";

export interface Recording<T> {
  values: T[];
  errors: unknown[];
  completed: number;
  next(value: T): void;
  error(error: unknown): void;
  complete(): void;
  observer: ObservableObserver<T>;
}

export function record<T>(): Recording<T> {
  const recording: Recording<T> = {
    values: [],
    errors: [],
    completed: 0,
    next(value) {
      recording.values.push(value);
    },
    error(error) {
      recording.errors.push(error);
    },
    complete() {
      recording.completed += 1;
    },
    observer: {
      next(value) {
        recording.next(value);
      },
      error(error) {
        recording.error(error);
      },
      complete() {
        recording.complete();
      }
    }
  };

  return recording;
}

export function cleanupCounter(): {
  readonly count: number;
  cleanup(): void;
} {
  let count = 0;

  return {
    get count() {
      return count;
    },
    cleanup() {
      count += 1;
    }
  };
}
