import { BasicSubscription, type Subscription } from "../subscription.ts";

export type EffectCleanup = void | (() => void);

// Lesson: an effect is terminal reactive work.
//
// It does not return a derived value. Its correctness comes from tracking reads,
// rerunning after invalidation, and cleaning up old side effects.
export function effect(run: () => EffectCleanup): Subscription {
  const cleanup = run();

  // TODO: Track signal dependencies and rerun with cleanup when they invalidate.
  //
  // Why it fails: the starter runs once and never connects itself to the signals
  // it reads. It also has only final cleanup, not cleanup-before-rerun.
  return new BasicSubscription(() => {
    if (typeof cleanup === "function") {
      cleanup();
    }
  });
}
