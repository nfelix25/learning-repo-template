// Lesson 08 supplement — Key Remapping with `as`
// ─────────────────────────────────────────────────────────────────────────────
// Practical examples of mapped types that rename or filter keys with `as`.
// This file is type-level only; the examples below are checked by TypeScript.
// ─────────────────────────────────────────────────────────────────────────────

export type PrefixKeys<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${Capitalize<K & string>}`]: T[K];
};

export type SuffixKeys<T, Suffix extends string> = {
  [K in keyof T as `${K & string}${Suffix}`]: T[K];
};

export type GetterMap<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

export type SetterMap<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (val: T[K]) => void;
};

export type ChangeEventMap<T> = {
  [K in keyof T as `${K & string}Changed`]: { previous: T[K]; current: T[K] };
};

export type PickByValue<T, Value> = {
  [K in keyof T as T[K] extends Value ? K : never]: T[K];
};

export type OmitByValue<T, Value> = {
  [K in keyof T as T[K] extends Value ? never : K]: T[K];
};

export type FunctionProps<T> = {
  [K in keyof T as T[K] extends (...args: never) => unknown ? K : never]: T[K];
};

export type DataProps<T> = {
  [K in keyof T as T[K] extends (...args: never) => unknown ? never : K]: T[K];
};

export type PublicProps<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

export type StripPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${infer S}` ? Uncapitalize<S> : K]: T[K];
};

export type RenameKey<T, From extends keyof T, To extends PropertyKey> = {
  [K in keyof T as K extends From ? To : K]: T[K];
};

export type RenameKeys<
  T,
  Names extends Partial<Record<keyof T, PropertyKey>>,
> = { [K in keyof T as Names[K] extends PropertyKey ? Names[K] : K]: T[K] };

export type ValidationErrors<T> = {
  [K in keyof T as `${K & string}Error`]?: string;
};

export type FormFields<T> = {
  [K in keyof T as `${K & string}Field`]: { name: K; value: T[K] };
};

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

type Expect<T extends true> = T;

type ApiUser = {
  id: string;
  name: string;
  age: number;
  active: boolean;
  createdAt: Date;
  _internalToken: string;
  save: () => Promise<void>;
  reload: () => void;
};

export type MappedAsExamples = [
  Expect<
    Equal<
      PrefixKeys<{ id: string; active: boolean }, "db">,
      {
        dbId: string;
        dbActive: boolean;
      }
    >
  >,
  Expect<
    Equal<
      SuffixKeys<{ name: string; age: number }, "Field">,
      {
        nameField: string;
        ageField: number;
      }
    >
  >,
  Expect<
    Equal<
      GetterMap<{ name: string; age: number }>,
      {
        getName: () => string;
        getAge: () => number;
      }
    >
  >,
  Expect<
    Equal<
      SetterMap<{ name: string; age: number }>,
      {
        setName: (value: string) => void;
        setAge: (value: number) => void;
      }
    >
  >,
  Expect<
    Equal<
      ChangeEventMap<{ name: string; active: boolean }>,
      {
        nameChanged: { previous: string; current: string };
        activeChanged: { previous: boolean; current: boolean };
      }
    >
  >,
  Expect<
    Equal<
      PickByValue<ApiUser, string>,
      {
        id: string;
        name: string;
        _internalToken: string;
      }
    >
  >,
  Expect<
    Equal<
      OmitByValue<ApiUser, string>,
      {
        age: number;
        active: boolean;
        createdAt: Date;
        save: () => Promise<void>;
        reload: () => void;
      }
    >
  >,
  Expect<
    Equal<
      FunctionProps<ApiUser>,
      {
        save: () => Promise<void>;
        reload: () => void;
      }
    >
  >,
  Expect<
    Equal<
      DataProps<ApiUser>,
      {
        id: string;
        name: string;
        age: number;
        active: boolean;
        createdAt: Date;
        _internalToken: string;
      }
    >
  >,
  Expect<
    Equal<
      PublicProps<ApiUser>,
      {
        id: string;
        name: string;
        age: number;
        active: boolean;
        createdAt: Date;
        save: () => Promise<void>;
        reload: () => void;
      }
    >
  >,
  Expect<
    Equal<
      StripPrefix<
        {
          apiUserId: string;
          apiCreatedAt: Date;
          name: string;
        },
        "api"
      >,
      {
        userId: string;
        createdAt: Date;
        name: string;
      }
    >
  >,
  Expect<
    Equal<
      RenameKey<{ id: string; name: string }, "id", "userId">,
      {
        userId: string;
        name: string;
      }
    >
  >,
  Expect<
    Equal<
      RenameKeys<
        {
          first_name: string;
          last_name: string;
          age: number;
        },
        {
          first_name: "firstName";
          last_name: "lastName";
        }
      >,
      {
        firstName: string;
        lastName: string;
        age: number;
      }
    >
  >,
  Expect<
    Equal<
      ValidationErrors<{ email: string; password: string }>,
      {
        emailError?: string;
        passwordError?: string;
      }
    >
  >,
  Expect<
    Equal<
      FormFields<{ email: string; rememberMe: boolean }>,
      {
        emailField: { name: "email"; value: string };
        rememberMeField: { name: "rememberMe"; value: boolean };
      }
    >
  >,
];
