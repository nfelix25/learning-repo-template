export type EventMap = object;

export type EventKeyOf<Events extends EventMap> = Extract<
  keyof Events,
  string | symbol
>;

export type Listener<Payload> = (payload: Payload) => void;

export type AnyListener<Events extends EventMap> = <
  K extends EventKeyOf<Events>,
>(
  event: K,
  payload: Events[K],
) => void;

export type PayloadOf<
  Events extends EventMap,
  K extends EventKeyOf<Events>,
> = Events[K];

export type EventUnion<Events extends EventMap> = {
  [K in EventKeyOf<Events>]: {
    type: K;
    payload: Events[K];
  };
}[EventKeyOf<Events>];

export type PrefixKeys<Prefix extends string, Events extends EventMap> = {
  [K in EventKeyOf<Events> as K extends string
    ? `${Prefix}:${K}`
    : never]: Events[K];
};
