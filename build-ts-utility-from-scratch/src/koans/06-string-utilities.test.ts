import type { Equal, Expect } from "../assertions";

/**
 * Koan 06: String and template-literal utilities
 *
 * Goal: parse string literal types with template-literal inference.
 * Mental model: template-literal conditionals are pattern matching over strings.
 * Common trap: once a type widens to `string`, literal parsing loses precision.
 * Stretch: make the case transform preserve already-camelized strings.
 */

type MyStartsWith<S extends string, Prefix extends string> = never;

type MyEndsWith<S extends string, Suffix extends string> = never;

type MySplitOnce<S extends string, Delimiter extends string> = never;

type MyRouteParam<S extends string> = never;

type MySnakeToCamel<S extends string> = never;

type cases = [
  Expect<Equal<MyStartsWith<"user:create", "user:">, true>>,
  Expect<Equal<MyStartsWith<"system:create", "user:">, false>>,
  Expect<Equal<MyEndsWith<"profile.json", ".json">, true>>,
  Expect<Equal<MySplitOnce<"user:created", ":">, ["user", "created"]>>,
  Expect<Equal<MyRouteParam<"/users/:userId/posts/:postId">, "userId" | "postId">>,
  Expect<Equal<MySnakeToCamel<"created_at">, "createdAt">>,
  Expect<Equal<MySnakeToCamel<"user_profile_url">, "userProfileUrl">>
];
