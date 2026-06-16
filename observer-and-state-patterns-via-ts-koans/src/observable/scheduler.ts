import { Observable } from "./observable.ts";

export interface ScheduledTask {
  cancelled: boolean;
  cancel(): void;
}

export class ManualScheduler {
  private queue: Array<() => void> = [];

  schedule(task: () => void): ScheduledTask {
    // Lesson: scheduling creates a gap between "work was requested" and "work
    // was delivered." Cancellation has to be checked when the task flushes.
    const scheduled = {
      cancelled: false,
      cancel() {
        scheduled.cancelled = true;
      }
    };

    this.queue.push(() => {
      if (!scheduled.cancelled) {
        task();
      }
    });

    return scheduled;
  }

  flush(): void {
    // Pressure point: flushing drains one logical queue. Tasks added while
    // flushing wait for the next flush, which keeps timing deterministic.
    const queued = this.queue;
    this.queue = [];

    for (const task of queued) {
      task();
    }
  }
}

export function scheduledValues<T>(values: T[], scheduler: ManualScheduler): Observable<T> {
  // Lesson: this observable makes deferred delivery visible without timers. The
  // returned teardown cancels every queued notification and completion.
  return new Observable<T>((observer) => {
    const tasks = values.map((value) =>
      scheduler.schedule(() => {
        observer.next(value);
      })
    );
    const completion = scheduler.schedule(() => {
      observer.complete();
    });

    return () => {
      for (const task of tasks) {
        task.cancel();
      }
      completion.cancel();
    };
  });
}
