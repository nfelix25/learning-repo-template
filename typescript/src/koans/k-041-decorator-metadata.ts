// ─── k-041: Decorator Metadata (TypeScript 5.2) ───────────────────────────────
//
// TypeScript 5.2 added support for the TC39 Decorator Metadata proposal.
// Each decorator context has a `.metadata` object shared by all decorators
// on the same class. At runtime, `Symbol.metadata` holds that object on the class.
//
// This lets decorators annotate classes in a standardized, composable way —
// without storing data on prototypes or using WeakMaps.
//
// Pattern:
//   function myDecorator(_, context) {
//     context.metadata["myKey"] ??= []
//     context.metadata["myKey"].push(context.name)
//   }
//   // After class definition:
//   MyClass[Symbol.metadata]["myKey"]  // ["methodA", "methodB"]
//
// Runtime availability note: Symbol.metadata requires Node.js 24.2+ or a polyfill.
// In environments without it, use a WeakMap fallback (shown in Part 4).
// The type system uses it regardless of runtime availability.
// ────────────────────────────────────────────────────────────────────────────��

import { describe, it, expect } from "vitest";

// Polyfill Symbol.metadata for environments that don't have it yet (Node < 24.2)
(Symbol as any).metadata ??= Symbol("metadata");

// ── Part 1: Collecting decorated method names ─────────────────────────────────
//
// `@tracked` marks methods whose names should be collected in class metadata.
// After class definition, `TrackedClass[Symbol.metadata]!.tracked` holds the names.

function tracked(
  _method: Function,
  context: ClassMethodDecoratorContext,
): void {
  const meta = context.metadata as Record<string, string[]>;
  meta["tracked"] ??= [];
  meta["tracked"].push(String(context.name));
}

class UserService {
  @tracked
  createUser(name: string) {
    return { name };
  }

  @tracked
  deleteUser(id: string) {
    return id;
  }

  getUser(id: string) {
    return id;
  } // not tracked
}

describe("@tracked metadata", () => {
  it("collects tracked method names in Symbol.metadata", () => {
    const meta = UserService[Symbol.metadata] as Record<string, string[]>;
    expect(meta["tracked"]).toContain("createUser");
    expect(meta["tracked"]).toContain("deleteUser");
  });
  it("does not include untracked methods", () => {
    const meta = UserService[Symbol.metadata] as Record<string, string[]>;
    expect(meta["tracked"]).not.toContain("getUser");
  });
});

// ── Part 2: Role-based access control via metadata ────────────────────────────
//
// `@requiresRole(role)` is a decorator factory. It records which methods require
// which roles in metadata. Then `getRequiredRole(Class, methodName)` reads it.
//
// This is the foundation of reflection-based auth (like NestJS guards).

function requiresRole(role: string) {
  return function (
    _method: Function,
    context: ClassMethodDecoratorContext,
  ): void {
    const meta = context.metadata as Record<string, Record<string, string>>;
    meta["roles"] ??= {};
    meta["roles"][String(context.name)] = role;
  };
}

function getRequiredRole(
  cls: Function,
  methodName: string,
): string | undefined {
  const meta = cls[Symbol.metadata] as Record<
    string,
    Record<string, string>
  > | null;
  return meta?.["roles"]?.[methodName];
}

class AdminPanel {
  @requiresRole("admin")
  deleteEverything() {
    return "deleted";
  }

  @requiresRole("moderator")
  banUser(id: string) {
    return id;
  }

  viewDashboard() {
    return "dashboard";
  } // public
}

describe("@requiresRole metadata", () => {
  it("records role for each decorated method", () => {
    expect(getRequiredRole(AdminPanel, "deleteEverything")).toBe("admin");
    expect(getRequiredRole(AdminPanel, "banUser")).toBe("moderator");
  });
  it("returns undefined for undecorated methods", () => {
    expect(getRequiredRole(AdminPanel, "viewDashboard")).toBeUndefined();
  });
});

// ── Part 3: Validation schema via field metadata ──────────────────────────────
//
// `@minLength(n)` records validation rules for fields in metadata.
// `validate(instance)` reads the rules and checks the actual values.

function minLength(n: number) {
  return function (
    _value: undefined,
    context: ClassFieldDecoratorContext,
  ): void {
    const meta = context.metadata as Record<
      string,
      Array<{ field: string; min: number }>
    >;
    meta["minLengthRules"] ??= [];
    meta["minLengthRules"].push({ field: String(context.name), min: n });
  };
}

function validate(instance: object): string[] {
  const meta = instance.constructor[Symbol.metadata] as Record<
    string,
    Array<{ field: string; min: number }>
  > | null;
  const rules = meta?.["minLengthRules"] ?? [];
  const errors: string[] = [];
  for (const { field, min } of rules) {
    const value = (instance as any)[field];
    if (typeof value === "string" && value.length < min) {
      errors.push(`${field} must be at least ${min} characters`);
    }
  }
  return errors;
}

class RegistrationForm {
  @minLength(3)
  username: string = "";

  @minLength(8)
  password: string = "";

  email: string = ""; // no validation
}

describe("@minLength validation metadata", () => {
  it("returns errors for short fields", () => {
    const form = new RegistrationForm();
    form.username = "ab";
    form.password = "short";
    const errors = validate(form);
    expect(errors).toContain("username must be at least 3 characters");
    expect(errors).toContain("password must be at least 8 characters");
  });
  it("returns no errors when fields are valid", () => {
    const form = new RegistrationForm();
    form.username = "alice";
    form.password = "securepassword";
    expect(validate(form)).toEqual([]);
  });
});
