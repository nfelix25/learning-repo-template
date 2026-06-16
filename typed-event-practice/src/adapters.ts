import type { EventKeyOf, EventMap, Listener } from "./event-map.js";
import type { Unsubscribe } from "./emitter.js";

export type StringEventKeyOf<Events extends EventMap> = Extract<
  keyof Events,
  string
>;

export class TypedCustomEvent<Detail> extends Event {
  constructor(
    type: string,
    readonly detail: Detail,
  ) {
    super(type);
  }
}

export class TypedEventTarget<Events extends EventMap> {
  private readonly target = new EventTarget();

  on<K extends StringEventKeyOf<Events>>(
    event: K,
    listener: Listener<Events[K]>,
  ): Unsubscribe {
    const wrapped = (raw: Event) => {
      listener((raw as TypedCustomEvent<Events[K]>).detail);
    };

    this.target.addEventListener(event, wrapped);

    return () => {
      this.target.removeEventListener(event, wrapped);
    };
  }

  emit<K extends StringEventKeyOf<Events>>(
    event: K,
    payload: Events[K],
  ): boolean {
    return this.target.dispatchEvent(new TypedCustomEvent(event, payload));
  }
}

export interface NodeStyleEmitter {
  on(eventName: string | symbol, listener: (...args: any[]) => void): unknown;
  off?(eventName: string | symbol, listener: (...args: any[]) => void): unknown;
  emit(eventName: string | symbol, ...args: any[]): boolean;
}

export type TupleEventKeyOf<Events extends EventMap> = {
  [K in EventKeyOf<Events>]: Events[K] extends readonly unknown[] ? K : never;
}[EventKeyOf<Events>];

export type TuplePayload<
  Events extends EventMap,
  K extends TupleEventKeyOf<Events>,
> = Events[K] extends readonly [...infer Args] ? Args : never;

export function bindNodeStyle<Events extends EventMap>(
  emitter: NodeStyleEmitter,
) {
  return {
    on<K extends TupleEventKeyOf<Events>>(
      event: K,
      listener: (...args: TuplePayload<Events, K>) => void,
    ) {
      emitter.on(event, listener as (...args: any[]) => void);
      return this;
    },

    off<K extends TupleEventKeyOf<Events>>(
      event: K,
      listener: (...args: TuplePayload<Events, K>) => void,
    ) {
      emitter.off?.(event, listener as (...args: any[]) => void);
      return this;
    },

    emit<K extends TupleEventKeyOf<Events>>(
      event: K,
      ...args: TuplePayload<Events, K>
    ): boolean {
      return emitter.emit(event, ...args);
    },
  };
}
