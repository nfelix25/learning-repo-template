import { expectTypeOf } from "vitest";
import type {
  Mutable,
  Optional,
  ReadonlyRequired,
  FilterByValue,
  Getters,
} from "./mapped-types";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

type User = {
  readonly id: number;
  readonly name: string;
  readonly email: string;
};

type Profile = {
  bio?: string;
  avatar?: string;
  displayName: string;
};

type Mixed = {
  count: number;
  label: string;
  active: boolean;
  onClick: () => void;
};

// ---------------------------------------------------------------------------
// 1. Mutable<T> — removes readonly from all properties
// ---------------------------------------------------------------------------

type MutableUser = Mutable<User>;

// All three keys must be present and non-readonly
expectTypeOf<MutableUser>().toEqualTypeOf<{
  id: number;
  name: string;
  email: string;
}>();

// Readonly variant must NOT be assignable (sanity check shape)
expectTypeOf<MutableUser>().not.toEqualTypeOf<User>();

// ---------------------------------------------------------------------------
// 2. Optional<T, K> — makes only the listed keys optional
// ---------------------------------------------------------------------------

type OptionalName = Optional<User, "name">;

// 'name' becomes optional; 'id' and 'email' stay as-is (readonly required)
expectTypeOf<OptionalName>().toEqualTypeOf<{
  readonly id: number;
  readonly name?: string;
  readonly email: string;
}>();

// ---------------------------------------------------------------------------
// 3. ReadonlyRequired<T> — all keys readonly AND required
// ---------------------------------------------------------------------------

type FrozenProfile = ReadonlyRequired<Profile>;

// No optional keys; all readonly
expectTypeOf<FrozenProfile>().toEqualTypeOf<{
  readonly bio: string;
  readonly avatar: string;
  readonly displayName: string;
}>();

// ---------------------------------------------------------------------------
// 4. FilterByValue<T, V> — keep only keys whose value type extends V
// ---------------------------------------------------------------------------

type StringKeys = FilterByValue<Mixed, string>;

expectTypeOf<StringKeys>().toEqualTypeOf<{ label: string }>();

type NumberOrBoolKeys = FilterByValue<Mixed, number | boolean>;

expectTypeOf<NumberOrBoolKeys>().toEqualTypeOf<{
  count: number;
  active: boolean;
}>();

// ---------------------------------------------------------------------------
// 5. Getters<T> — produce { getFoo(): T['foo'], ... }
// ---------------------------------------------------------------------------

type UserGetters = Getters<{ name: string; age: number }>;

expectTypeOf<UserGetters>().toEqualTypeOf<{
  getName: () => string;
  getAge: () => number;
}>();
