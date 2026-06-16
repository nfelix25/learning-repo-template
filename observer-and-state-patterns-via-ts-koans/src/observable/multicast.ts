import { Observable } from "./observable.ts";
import { Subject } from "../observer/subject.ts";
import type { Operator } from "./observable.ts";

export function coldFromFactory<T>(factory: () => T[]): Observable<T> {
  // Lesson: cold means every subscriber starts its own producer execution.
  return new Observable<T>((observer) => {
    for (const value of factory()) {
      observer.next(value);
    }
    observer.complete();
  });
}

export function share<T>(): Operator<T, T> {
  // Lesson: share turns one source subscription into a shared hot delivery path.
  // The hard parts are connection lifetime, terminal forwarding, and replay
  // policy. This starter intentionally handles only the first connection.
  return (source) => {
    const subject = new Subject<T>();
    let connected = false;

    return new Observable<T>((observer) => {
      const subscription = subject.subscribe((value) => observer.next(value));

      if (!connected) {
        connected = true;
        // TODO: Share source completion/error and disconnect when the last observer leaves.
        //
        // Why it fails: values produced before later subscribers join are lost,
        // terminal notifications are ignored, and the source connection is never
        // released when the last subscriber leaves.
        source.subscribe((value) => subject.next(value));
      }

      return subscription;
    });
  };
}

export class ReplaySubject<T> extends Subject<T> {
  private buffer: T[] = [];
  private size: number;

  constructor(size: number) {
    super();
    this.size = size;
  }

  override next(value: T): void {
    // Lesson: replay is explicit storage. The buffer is independent from live
    // delivery; late subscribers need both buffered history and future values.
    this.buffer.push(value);
    this.buffer = this.buffer.slice(-this.size);
    super.next(value);
  }

  // TODO: Replay buffered values to new subscribers before future live values.
  //
  // Why it fails: this class records history but never sends it to a late
  // subscriber. The invariant is "buffer first, then live subscription."
}
