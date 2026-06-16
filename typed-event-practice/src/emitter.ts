import type {
  AnyListener,
  EventKeyOf,
  EventMap,
  Listener,
} from "./event-map.js";

export type Unsubscribe = () => void;

type StoredListener<Events extends EventMap> = Listener<
  Events[EventKeyOf<Events>]
>;

export class TypedEmitter<Events extends EventMap> {
  private readonly listeners = new Map<
    EventKeyOf<Events>,
    Set<StoredListener<Events>>
  >();
  private readonly anyListeners = new Set<AnyListener<Events>>();

  on<K extends EventKeyOf<Events>>(
    event: K,
    listener: Listener<Events[K]>,
  ): this {
    this.listenersFor(event).add(listener);
    return this;
  }

  subscribe<K extends EventKeyOf<Events>>(
    event: K,
    listener: Listener<Events[K]>,
  ): Unsubscribe {
    this.on(event, listener);
    return () => {
      this.off(event, listener);
    };
  }

  off<K extends EventKeyOf<Events>>(
    event: K,
    listener: Listener<Events[K]>,
  ): this {
    const listeners = this.listeners.get(event) as
      | Set<Listener<Events[K]>>
      | undefined;

    listeners?.delete(listener);

    if (listeners?.size === 0) {
      this.listeners.delete(event);
    }

    return this;
  }

  once<K extends EventKeyOf<Events>>(
    event: K,
    listener: Listener<Events[K]>,
  ): this {
    const wrapped: Listener<Events[K]> = (payload) => {
      this.off(event, wrapped);
      listener(payload);
    };

    return this.on(event, wrapped);
  }

  onAny(listener: AnyListener<Events>): this {
    this.anyListeners.add(listener);
    return this;
  }

  offAny(listener: AnyListener<Events>): this {
    this.anyListeners.delete(listener);
    return this;
  }

  emit<K extends EventKeyOf<Events>>(event: K, payload: Events[K]): boolean {
    const listeners = this.listeners.get(event) as
      | Set<Listener<Events[K]>>
      | undefined;
    const specificListeners = listeners ? [...listeners] : [];
    const anyListeners = [...this.anyListeners];

    for (const listener of specificListeners) {
      listener(payload);
    }

    for (const listener of anyListeners) {
      listener(event, payload);
    }

    return specificListeners.length > 0 || anyListeners.length > 0;
  }

  listenerCount<K extends EventKeyOf<Events>>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  clear<K extends EventKeyOf<Events>>(event?: K): this {
    if (event === undefined) {
      this.listeners.clear();
      this.anyListeners.clear();
      return this;
    }

    this.listeners.delete(event);
    return this;
  }

  private listenersFor<K extends EventKeyOf<Events>>(
    event: K,
  ): Set<Listener<Events[K]>> {
    let listeners = this.listeners.get(event);

    if (!listeners) {
      listeners = new Set<StoredListener<Events>>();
      this.listeners.set(event, listeners);
    }

    return listeners as Set<Listener<Events[K]>>;
  }
}
