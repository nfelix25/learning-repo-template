import type { EventKeyOf, EventMap } from "./event-map.js";
import type { TypedEmitter } from "./emitter.js";

export type DeliveryMode = "sync" | "microtask" | "macrotask";

export function scheduleDelivery(
  mode: DeliveryMode,
  deliver: () => void,
): void {
  if (mode === "sync") {
    deliver();
    return;
  }

  if (mode === "microtask") {
    queueMicrotask(deliver);
    return;
  }

  setTimeout(deliver, 0);
}

export function emitScheduled<
  Events extends EventMap,
  K extends EventKeyOf<Events>,
>(
  emitter: TypedEmitter<Events>,
  mode: DeliveryMode,
  event: K,
  payload: Events[K],
): Promise<boolean> {
  return new Promise((resolve) => {
    scheduleDelivery(mode, () => {
      resolve(emitter.emit(event, payload));
    });
  });
}
