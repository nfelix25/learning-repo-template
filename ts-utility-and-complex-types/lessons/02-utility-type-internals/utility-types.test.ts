import { expectTypeOf } from "vitest";
import type {
  MyPartial,
  MyPick,
  MyOmit,
  MyExclude,
  MyReturnType,
} from "./utility-types.ts";

type User = { id: number; name: string; email: string; role: "admin" | "user" };

// ---------------------------------------------------------------------------
// 1. MyPartial
// ---------------------------------------------------------------------------

expectTypeOf<MyPartial<User>>().toEqualTypeOf<{
  id?: number;
  name?: string;
  email?: string;
  role?: "admin" | "user";
}>();

// ---------------------------------------------------------------------------
// 2. MyPick
// ---------------------------------------------------------------------------

expectTypeOf<MyPick<User, "id" | "name">>().toEqualTypeOf<{
  id: number;
  name: string;
}>();

// Single key
expectTypeOf<MyPick<User, "role">>().toEqualTypeOf<{
  role: "admin" | "user";
}>();

// ---------------------------------------------------------------------------
// 3. MyOmit
// ---------------------------------------------------------------------------

expectTypeOf<MyOmit<User, "email">>().toEqualTypeOf<{
  id: number;
  name: string;
  role: "admin" | "user";
}>();

expectTypeOf<MyOmit<User, "id" | "role">>().toEqualTypeOf<{
  name: string;
  email: string;
}>();

// ---------------------------------------------------------------------------
// 4. MyExclude
// ---------------------------------------------------------------------------

expectTypeOf<MyExclude<string | number | boolean, string>>().toEqualTypeOf<
  number | boolean
>();

expectTypeOf<MyExclude<"a" | "b" | "c", "a" | "c">>().toEqualTypeOf<"b">();

// Excluding everything produces never
expectTypeOf<MyExclude<string, string>>().toEqualTypeOf<never>();

// ---------------------------------------------------------------------------
// 5. MyReturnType
// ---------------------------------------------------------------------------

declare function getUser(id: number): User;
declare function getIds(): number[];

expectTypeOf<MyReturnType<typeof getUser>>().toEqualTypeOf<User>();
expectTypeOf<MyReturnType<typeof getIds>>().toEqualTypeOf<number[]>();
expectTypeOf<MyReturnType<() => void>>().toEqualTypeOf<void>();
