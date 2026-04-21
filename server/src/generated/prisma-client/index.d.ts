
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Organisation
 * 
 */
export type Organisation = $Result.DefaultSelection<Prisma.$OrganisationPayload>
/**
 * Model HiringDrive
 * 
 */
export type HiringDrive = $Result.DefaultSelection<Prisma.$HiringDrivePayload>
/**
 * Model DriveCandidate
 * 
 */
export type DriveCandidate = $Result.DefaultSelection<Prisma.$DriveCandidatePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organisation`: Exposes CRUD operations for the **Organisation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organisations
    * const organisations = await prisma.organisation.findMany()
    * ```
    */
  get organisation(): Prisma.OrganisationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hiringDrive`: Exposes CRUD operations for the **HiringDrive** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HiringDrives
    * const hiringDrives = await prisma.hiringDrive.findMany()
    * ```
    */
  get hiringDrive(): Prisma.HiringDriveDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.driveCandidate`: Exposes CRUD operations for the **DriveCandidate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DriveCandidates
    * const driveCandidates = await prisma.driveCandidate.findMany()
    * ```
    */
  get driveCandidate(): Prisma.DriveCandidateDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Organisation: 'Organisation',
    HiringDrive: 'HiringDrive',
    DriveCandidate: 'DriveCandidate'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "organisation" | "hiringDrive" | "driveCandidate"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Organisation: {
        payload: Prisma.$OrganisationPayload<ExtArgs>
        fields: Prisma.OrganisationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganisationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganisationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          findFirst: {
            args: Prisma.OrganisationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganisationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          findMany: {
            args: Prisma.OrganisationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          create: {
            args: Prisma.OrganisationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          createMany: {
            args: Prisma.OrganisationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganisationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          delete: {
            args: Prisma.OrganisationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          update: {
            args: Prisma.OrganisationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          deleteMany: {
            args: Prisma.OrganisationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganisationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganisationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>[]
          }
          upsert: {
            args: Prisma.OrganisationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganisationPayload>
          }
          aggregate: {
            args: Prisma.OrganisationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganisation>
          }
          groupBy: {
            args: Prisma.OrganisationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganisationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganisationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganisationCountAggregateOutputType> | number
          }
        }
      }
      HiringDrive: {
        payload: Prisma.$HiringDrivePayload<ExtArgs>
        fields: Prisma.HiringDriveFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HiringDriveFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HiringDriveFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>
          }
          findFirst: {
            args: Prisma.HiringDriveFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HiringDriveFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>
          }
          findMany: {
            args: Prisma.HiringDriveFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>[]
          }
          create: {
            args: Prisma.HiringDriveCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>
          }
          createMany: {
            args: Prisma.HiringDriveCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HiringDriveCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>[]
          }
          delete: {
            args: Prisma.HiringDriveDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>
          }
          update: {
            args: Prisma.HiringDriveUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>
          }
          deleteMany: {
            args: Prisma.HiringDriveDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HiringDriveUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HiringDriveUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>[]
          }
          upsert: {
            args: Prisma.HiringDriveUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HiringDrivePayload>
          }
          aggregate: {
            args: Prisma.HiringDriveAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHiringDrive>
          }
          groupBy: {
            args: Prisma.HiringDriveGroupByArgs<ExtArgs>
            result: $Utils.Optional<HiringDriveGroupByOutputType>[]
          }
          count: {
            args: Prisma.HiringDriveCountArgs<ExtArgs>
            result: $Utils.Optional<HiringDriveCountAggregateOutputType> | number
          }
        }
      }
      DriveCandidate: {
        payload: Prisma.$DriveCandidatePayload<ExtArgs>
        fields: Prisma.DriveCandidateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DriveCandidateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DriveCandidateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>
          }
          findFirst: {
            args: Prisma.DriveCandidateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DriveCandidateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>
          }
          findMany: {
            args: Prisma.DriveCandidateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>[]
          }
          create: {
            args: Prisma.DriveCandidateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>
          }
          createMany: {
            args: Prisma.DriveCandidateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DriveCandidateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>[]
          }
          delete: {
            args: Prisma.DriveCandidateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>
          }
          update: {
            args: Prisma.DriveCandidateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>
          }
          deleteMany: {
            args: Prisma.DriveCandidateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DriveCandidateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DriveCandidateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>[]
          }
          upsert: {
            args: Prisma.DriveCandidateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriveCandidatePayload>
          }
          aggregate: {
            args: Prisma.DriveCandidateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDriveCandidate>
          }
          groupBy: {
            args: Prisma.DriveCandidateGroupByArgs<ExtArgs>
            result: $Utils.Optional<DriveCandidateGroupByOutputType>[]
          }
          count: {
            args: Prisma.DriveCandidateCountArgs<ExtArgs>
            result: $Utils.Optional<DriveCandidateCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    organisation?: OrganisationOmit
    hiringDrive?: HiringDriveOmit
    driveCandidate?: DriveCandidateOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganisationCountOutputType
   */

  export type OrganisationCountOutputType = {
    members: number
    drives: number
  }

  export type OrganisationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | OrganisationCountOutputTypeCountMembersArgs
    drives?: boolean | OrganisationCountOutputTypeCountDrivesArgs
  }

  // Custom InputTypes
  /**
   * OrganisationCountOutputType without action
   */
  export type OrganisationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganisationCountOutputType
     */
    select?: OrganisationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganisationCountOutputType without action
   */
  export type OrganisationCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * OrganisationCountOutputType without action
   */
  export type OrganisationCountOutputTypeCountDrivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HiringDriveWhereInput
  }


  /**
   * Count Type HiringDriveCountOutputType
   */

  export type HiringDriveCountOutputType = {
    candidates: number
  }

  export type HiringDriveCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    candidates?: boolean | HiringDriveCountOutputTypeCountCandidatesArgs
  }

  // Custom InputTypes
  /**
   * HiringDriveCountOutputType without action
   */
  export type HiringDriveCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDriveCountOutputType
     */
    select?: HiringDriveCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HiringDriveCountOutputType without action
   */
  export type HiringDriveCountOutputTypeCountCandidatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriveCandidateWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    supabaseUserId: string | null
    oauthProvider: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    organisationId: string | null
    organisationRole: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    supabaseUserId: string | null
    oauthProvider: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    organisationId: string | null
    organisationRole: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    fullName: number
    email: number
    passwordHash: number
    supabaseUserId: number
    oauthProvider: number
    isActive: number
    createdAt: number
    updatedAt: number
    organisationId: number
    organisationRole: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    passwordHash?: true
    supabaseUserId?: true
    oauthProvider?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    organisationId?: true
    organisationRole?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    passwordHash?: true
    supabaseUserId?: true
    oauthProvider?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    organisationId?: true
    organisationRole?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    fullName?: true
    email?: true
    passwordHash?: true
    supabaseUserId?: true
    oauthProvider?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    organisationId?: true
    organisationRole?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    fullName: string
    email: string
    passwordHash: string | null
    supabaseUserId: string | null
    oauthProvider: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    organisationId: string | null
    organisationRole: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    supabaseUserId?: boolean
    oauthProvider?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisationId?: boolean
    organisationRole?: boolean
    organisation?: boolean | User$organisationArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    supabaseUserId?: boolean
    oauthProvider?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisationId?: boolean
    organisationRole?: boolean
    organisation?: boolean | User$organisationArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    supabaseUserId?: boolean
    oauthProvider?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisationId?: boolean
    organisationRole?: boolean
    organisation?: boolean | User$organisationArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    supabaseUserId?: boolean
    oauthProvider?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisationId?: boolean
    organisationRole?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "email" | "passwordHash" | "supabaseUserId" | "oauthProvider" | "isActive" | "createdAt" | "updatedAt" | "organisationId" | "organisationRole", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | User$organisationArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | User$organisationArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | User$organisationArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      organisation: Prisma.$OrganisationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      email: string
      passwordHash: string | null
      supabaseUserId: string | null
      oauthProvider: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      organisationId: string | null
      organisationRole: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organisation<T extends User$organisationArgs<ExtArgs> = {}>(args?: Subset<T, User$organisationArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly supabaseUserId: FieldRef<"User", 'String'>
    readonly oauthProvider: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly organisationId: FieldRef<"User", 'String'>
    readonly organisationRole: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.organisation
   */
  export type User$organisationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    where?: OrganisationWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Organisation
   */

  export type AggregateOrganisation = {
    _count: OrganisationCountAggregateOutputType | null
    _min: OrganisationMinAggregateOutputType | null
    _max: OrganisationMaxAggregateOutputType | null
  }

  export type OrganisationMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    orgCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    orgCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganisationCountAggregateOutputType = {
    id: number
    name: number
    description: number
    category: number
    orgCode: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrganisationMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    orgCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    orgCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganisationCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    orgCode?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrganisationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organisation to aggregate.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organisations
    **/
    _count?: true | OrganisationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganisationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganisationMaxAggregateInputType
  }

  export type GetOrganisationAggregateType<T extends OrganisationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganisation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganisation[P]>
      : GetScalarType<T[P], AggregateOrganisation[P]>
  }




  export type OrganisationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganisationWhereInput
    orderBy?: OrganisationOrderByWithAggregationInput | OrganisationOrderByWithAggregationInput[]
    by: OrganisationScalarFieldEnum[] | OrganisationScalarFieldEnum
    having?: OrganisationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganisationCountAggregateInputType | true
    _min?: OrganisationMinAggregateInputType
    _max?: OrganisationMaxAggregateInputType
  }

  export type OrganisationGroupByOutputType = {
    id: string
    name: string
    description: string | null
    category: string
    orgCode: string
    createdAt: Date
    updatedAt: Date
    _count: OrganisationCountAggregateOutputType | null
    _min: OrganisationMinAggregateOutputType | null
    _max: OrganisationMaxAggregateOutputType | null
  }

  type GetOrganisationGroupByPayload<T extends OrganisationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganisationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganisationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganisationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganisationGroupByOutputType[P]>
        }
      >
    >


  export type OrganisationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    orgCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | Organisation$membersArgs<ExtArgs>
    drives?: boolean | Organisation$drivesArgs<ExtArgs>
    _count?: boolean | OrganisationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    orgCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    orgCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["organisation"]>

  export type OrganisationSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    orgCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrganisationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "category" | "orgCode" | "createdAt" | "updatedAt", ExtArgs["result"]["organisation"]>
  export type OrganisationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Organisation$membersArgs<ExtArgs>
    drives?: boolean | Organisation$drivesArgs<ExtArgs>
    _count?: boolean | OrganisationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganisationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrganisationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganisationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organisation"
    objects: {
      members: Prisma.$UserPayload<ExtArgs>[]
      drives: Prisma.$HiringDrivePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      category: string
      orgCode: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["organisation"]>
    composites: {}
  }

  type OrganisationGetPayload<S extends boolean | null | undefined | OrganisationDefaultArgs> = $Result.GetResult<Prisma.$OrganisationPayload, S>

  type OrganisationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganisationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganisationCountAggregateInputType | true
    }

  export interface OrganisationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organisation'], meta: { name: 'Organisation' } }
    /**
     * Find zero or one Organisation that matches the filter.
     * @param {OrganisationFindUniqueArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganisationFindUniqueArgs>(args: SelectSubset<T, OrganisationFindUniqueArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organisation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganisationFindUniqueOrThrowArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganisationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganisationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organisation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindFirstArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganisationFindFirstArgs>(args?: SelectSubset<T, OrganisationFindFirstArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organisation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindFirstOrThrowArgs} args - Arguments to find a Organisation
     * @example
     * // Get one Organisation
     * const organisation = await prisma.organisation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganisationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganisationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organisations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organisations
     * const organisations = await prisma.organisation.findMany()
     * 
     * // Get first 10 Organisations
     * const organisations = await prisma.organisation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organisationWithIdOnly = await prisma.organisation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganisationFindManyArgs>(args?: SelectSubset<T, OrganisationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organisation.
     * @param {OrganisationCreateArgs} args - Arguments to create a Organisation.
     * @example
     * // Create one Organisation
     * const Organisation = await prisma.organisation.create({
     *   data: {
     *     // ... data to create a Organisation
     *   }
     * })
     * 
     */
    create<T extends OrganisationCreateArgs>(args: SelectSubset<T, OrganisationCreateArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organisations.
     * @param {OrganisationCreateManyArgs} args - Arguments to create many Organisations.
     * @example
     * // Create many Organisations
     * const organisation = await prisma.organisation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganisationCreateManyArgs>(args?: SelectSubset<T, OrganisationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organisations and returns the data saved in the database.
     * @param {OrganisationCreateManyAndReturnArgs} args - Arguments to create many Organisations.
     * @example
     * // Create many Organisations
     * const organisation = await prisma.organisation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organisations and only return the `id`
     * const organisationWithIdOnly = await prisma.organisation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganisationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganisationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organisation.
     * @param {OrganisationDeleteArgs} args - Arguments to delete one Organisation.
     * @example
     * // Delete one Organisation
     * const Organisation = await prisma.organisation.delete({
     *   where: {
     *     // ... filter to delete one Organisation
     *   }
     * })
     * 
     */
    delete<T extends OrganisationDeleteArgs>(args: SelectSubset<T, OrganisationDeleteArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organisation.
     * @param {OrganisationUpdateArgs} args - Arguments to update one Organisation.
     * @example
     * // Update one Organisation
     * const organisation = await prisma.organisation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganisationUpdateArgs>(args: SelectSubset<T, OrganisationUpdateArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organisations.
     * @param {OrganisationDeleteManyArgs} args - Arguments to filter Organisations to delete.
     * @example
     * // Delete a few Organisations
     * const { count } = await prisma.organisation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganisationDeleteManyArgs>(args?: SelectSubset<T, OrganisationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organisations
     * const organisation = await prisma.organisation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganisationUpdateManyArgs>(args: SelectSubset<T, OrganisationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organisations and returns the data updated in the database.
     * @param {OrganisationUpdateManyAndReturnArgs} args - Arguments to update many Organisations.
     * @example
     * // Update many Organisations
     * const organisation = await prisma.organisation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organisations and only return the `id`
     * const organisationWithIdOnly = await prisma.organisation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganisationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganisationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organisation.
     * @param {OrganisationUpsertArgs} args - Arguments to update or create a Organisation.
     * @example
     * // Update or create a Organisation
     * const organisation = await prisma.organisation.upsert({
     *   create: {
     *     // ... data to create a Organisation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organisation we want to update
     *   }
     * })
     */
    upsert<T extends OrganisationUpsertArgs>(args: SelectSubset<T, OrganisationUpsertArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationCountArgs} args - Arguments to filter Organisations to count.
     * @example
     * // Count the number of Organisations
     * const count = await prisma.organisation.count({
     *   where: {
     *     // ... the filter for the Organisations we want to count
     *   }
     * })
    **/
    count<T extends OrganisationCountArgs>(
      args?: Subset<T, OrganisationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganisationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganisationAggregateArgs>(args: Subset<T, OrganisationAggregateArgs>): Prisma.PrismaPromise<GetOrganisationAggregateType<T>>

    /**
     * Group by Organisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganisationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganisationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganisationGroupByArgs['orderBy'] }
        : { orderBy?: OrganisationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganisationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganisationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organisation model
   */
  readonly fields: OrganisationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organisation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganisationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Organisation$membersArgs<ExtArgs> = {}>(args?: Subset<T, Organisation$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    drives<T extends Organisation$drivesArgs<ExtArgs> = {}>(args?: Subset<T, Organisation$drivesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organisation model
   */
  interface OrganisationFieldRefs {
    readonly id: FieldRef<"Organisation", 'String'>
    readonly name: FieldRef<"Organisation", 'String'>
    readonly description: FieldRef<"Organisation", 'String'>
    readonly category: FieldRef<"Organisation", 'String'>
    readonly orgCode: FieldRef<"Organisation", 'String'>
    readonly createdAt: FieldRef<"Organisation", 'DateTime'>
    readonly updatedAt: FieldRef<"Organisation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organisation findUnique
   */
  export type OrganisationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation findUniqueOrThrow
   */
  export type OrganisationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation findFirst
   */
  export type OrganisationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organisations.
     */
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation findFirstOrThrow
   */
  export type OrganisationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisation to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organisations.
     */
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation findMany
   */
  export type OrganisationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter, which Organisations to fetch.
     */
    where?: OrganisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organisations to fetch.
     */
    orderBy?: OrganisationOrderByWithRelationInput | OrganisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organisations.
     */
    cursor?: OrganisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organisations.
     */
    skip?: number
    distinct?: OrganisationScalarFieldEnum | OrganisationScalarFieldEnum[]
  }

  /**
   * Organisation create
   */
  export type OrganisationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organisation.
     */
    data: XOR<OrganisationCreateInput, OrganisationUncheckedCreateInput>
  }

  /**
   * Organisation createMany
   */
  export type OrganisationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organisations.
     */
    data: OrganisationCreateManyInput | OrganisationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organisation createManyAndReturn
   */
  export type OrganisationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * The data used to create many Organisations.
     */
    data: OrganisationCreateManyInput | OrganisationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organisation update
   */
  export type OrganisationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organisation.
     */
    data: XOR<OrganisationUpdateInput, OrganisationUncheckedUpdateInput>
    /**
     * Choose, which Organisation to update.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation updateMany
   */
  export type OrganisationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organisations.
     */
    data: XOR<OrganisationUpdateManyMutationInput, OrganisationUncheckedUpdateManyInput>
    /**
     * Filter which Organisations to update
     */
    where?: OrganisationWhereInput
    /**
     * Limit how many Organisations to update.
     */
    limit?: number
  }

  /**
   * Organisation updateManyAndReturn
   */
  export type OrganisationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * The data used to update Organisations.
     */
    data: XOR<OrganisationUpdateManyMutationInput, OrganisationUncheckedUpdateManyInput>
    /**
     * Filter which Organisations to update
     */
    where?: OrganisationWhereInput
    /**
     * Limit how many Organisations to update.
     */
    limit?: number
  }

  /**
   * Organisation upsert
   */
  export type OrganisationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organisation to update in case it exists.
     */
    where: OrganisationWhereUniqueInput
    /**
     * In case the Organisation found by the `where` argument doesn't exist, create a new Organisation with this data.
     */
    create: XOR<OrganisationCreateInput, OrganisationUncheckedCreateInput>
    /**
     * In case the Organisation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganisationUpdateInput, OrganisationUncheckedUpdateInput>
  }

  /**
   * Organisation delete
   */
  export type OrganisationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
    /**
     * Filter which Organisation to delete.
     */
    where: OrganisationWhereUniqueInput
  }

  /**
   * Organisation deleteMany
   */
  export type OrganisationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organisations to delete
     */
    where?: OrganisationWhereInput
    /**
     * Limit how many Organisations to delete.
     */
    limit?: number
  }

  /**
   * Organisation.members
   */
  export type Organisation$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Organisation.drives
   */
  export type Organisation$drivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    where?: HiringDriveWhereInput
    orderBy?: HiringDriveOrderByWithRelationInput | HiringDriveOrderByWithRelationInput[]
    cursor?: HiringDriveWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HiringDriveScalarFieldEnum | HiringDriveScalarFieldEnum[]
  }

  /**
   * Organisation without action
   */
  export type OrganisationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organisation
     */
    select?: OrganisationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organisation
     */
    omit?: OrganisationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganisationInclude<ExtArgs> | null
  }


  /**
   * Model HiringDrive
   */

  export type AggregateHiringDrive = {
    _count: HiringDriveCountAggregateOutputType | null
    _min: HiringDriveMinAggregateOutputType | null
    _max: HiringDriveMaxAggregateOutputType | null
  }

  export type HiringDriveMinAggregateOutputType = {
    id: string | null
    role: string | null
    description: string | null
    isActive: boolean | null
    organisationId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HiringDriveMaxAggregateOutputType = {
    id: string | null
    role: string | null
    description: string | null
    isActive: boolean | null
    organisationId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HiringDriveCountAggregateOutputType = {
    id: number
    role: number
    description: number
    isActive: number
    organisationId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HiringDriveMinAggregateInputType = {
    id?: true
    role?: true
    description?: true
    isActive?: true
    organisationId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HiringDriveMaxAggregateInputType = {
    id?: true
    role?: true
    description?: true
    isActive?: true
    organisationId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HiringDriveCountAggregateInputType = {
    id?: true
    role?: true
    description?: true
    isActive?: true
    organisationId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HiringDriveAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HiringDrive to aggregate.
     */
    where?: HiringDriveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HiringDrives to fetch.
     */
    orderBy?: HiringDriveOrderByWithRelationInput | HiringDriveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HiringDriveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HiringDrives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HiringDrives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HiringDrives
    **/
    _count?: true | HiringDriveCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HiringDriveMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HiringDriveMaxAggregateInputType
  }

  export type GetHiringDriveAggregateType<T extends HiringDriveAggregateArgs> = {
        [P in keyof T & keyof AggregateHiringDrive]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHiringDrive[P]>
      : GetScalarType<T[P], AggregateHiringDrive[P]>
  }




  export type HiringDriveGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HiringDriveWhereInput
    orderBy?: HiringDriveOrderByWithAggregationInput | HiringDriveOrderByWithAggregationInput[]
    by: HiringDriveScalarFieldEnum[] | HiringDriveScalarFieldEnum
    having?: HiringDriveScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HiringDriveCountAggregateInputType | true
    _min?: HiringDriveMinAggregateInputType
    _max?: HiringDriveMaxAggregateInputType
  }

  export type HiringDriveGroupByOutputType = {
    id: string
    role: string
    description: string | null
    isActive: boolean
    organisationId: string
    createdAt: Date
    updatedAt: Date
    _count: HiringDriveCountAggregateOutputType | null
    _min: HiringDriveMinAggregateOutputType | null
    _max: HiringDriveMaxAggregateOutputType | null
  }

  type GetHiringDriveGroupByPayload<T extends HiringDriveGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HiringDriveGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HiringDriveGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HiringDriveGroupByOutputType[P]>
            : GetScalarType<T[P], HiringDriveGroupByOutputType[P]>
        }
      >
    >


  export type HiringDriveSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    description?: boolean
    isActive?: boolean
    organisationId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
    candidates?: boolean | HiringDrive$candidatesArgs<ExtArgs>
    _count?: boolean | HiringDriveCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hiringDrive"]>

  export type HiringDriveSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    description?: boolean
    isActive?: boolean
    organisationId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hiringDrive"]>

  export type HiringDriveSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    description?: boolean
    isActive?: boolean
    organisationId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hiringDrive"]>

  export type HiringDriveSelectScalar = {
    id?: boolean
    role?: boolean
    description?: boolean
    isActive?: boolean
    organisationId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HiringDriveOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "description" | "isActive" | "organisationId" | "createdAt" | "updatedAt", ExtArgs["result"]["hiringDrive"]>
  export type HiringDriveInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
    candidates?: boolean | HiringDrive$candidatesArgs<ExtArgs>
    _count?: boolean | HiringDriveCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HiringDriveIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
  }
  export type HiringDriveIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organisation?: boolean | OrganisationDefaultArgs<ExtArgs>
  }

  export type $HiringDrivePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HiringDrive"
    objects: {
      organisation: Prisma.$OrganisationPayload<ExtArgs>
      candidates: Prisma.$DriveCandidatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: string
      description: string | null
      isActive: boolean
      organisationId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hiringDrive"]>
    composites: {}
  }

  type HiringDriveGetPayload<S extends boolean | null | undefined | HiringDriveDefaultArgs> = $Result.GetResult<Prisma.$HiringDrivePayload, S>

  type HiringDriveCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HiringDriveFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HiringDriveCountAggregateInputType | true
    }

  export interface HiringDriveDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HiringDrive'], meta: { name: 'HiringDrive' } }
    /**
     * Find zero or one HiringDrive that matches the filter.
     * @param {HiringDriveFindUniqueArgs} args - Arguments to find a HiringDrive
     * @example
     * // Get one HiringDrive
     * const hiringDrive = await prisma.hiringDrive.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HiringDriveFindUniqueArgs>(args: SelectSubset<T, HiringDriveFindUniqueArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HiringDrive that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HiringDriveFindUniqueOrThrowArgs} args - Arguments to find a HiringDrive
     * @example
     * // Get one HiringDrive
     * const hiringDrive = await prisma.hiringDrive.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HiringDriveFindUniqueOrThrowArgs>(args: SelectSubset<T, HiringDriveFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HiringDrive that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HiringDriveFindFirstArgs} args - Arguments to find a HiringDrive
     * @example
     * // Get one HiringDrive
     * const hiringDrive = await prisma.hiringDrive.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HiringDriveFindFirstArgs>(args?: SelectSubset<T, HiringDriveFindFirstArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HiringDrive that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HiringDriveFindFirstOrThrowArgs} args - Arguments to find a HiringDrive
     * @example
     * // Get one HiringDrive
     * const hiringDrive = await prisma.hiringDrive.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HiringDriveFindFirstOrThrowArgs>(args?: SelectSubset<T, HiringDriveFindFirstOrThrowArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HiringDrives that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HiringDriveFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HiringDrives
     * const hiringDrives = await prisma.hiringDrive.findMany()
     * 
     * // Get first 10 HiringDrives
     * const hiringDrives = await prisma.hiringDrive.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hiringDriveWithIdOnly = await prisma.hiringDrive.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HiringDriveFindManyArgs>(args?: SelectSubset<T, HiringDriveFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HiringDrive.
     * @param {HiringDriveCreateArgs} args - Arguments to create a HiringDrive.
     * @example
     * // Create one HiringDrive
     * const HiringDrive = await prisma.hiringDrive.create({
     *   data: {
     *     // ... data to create a HiringDrive
     *   }
     * })
     * 
     */
    create<T extends HiringDriveCreateArgs>(args: SelectSubset<T, HiringDriveCreateArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HiringDrives.
     * @param {HiringDriveCreateManyArgs} args - Arguments to create many HiringDrives.
     * @example
     * // Create many HiringDrives
     * const hiringDrive = await prisma.hiringDrive.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HiringDriveCreateManyArgs>(args?: SelectSubset<T, HiringDriveCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HiringDrives and returns the data saved in the database.
     * @param {HiringDriveCreateManyAndReturnArgs} args - Arguments to create many HiringDrives.
     * @example
     * // Create many HiringDrives
     * const hiringDrive = await prisma.hiringDrive.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HiringDrives and only return the `id`
     * const hiringDriveWithIdOnly = await prisma.hiringDrive.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HiringDriveCreateManyAndReturnArgs>(args?: SelectSubset<T, HiringDriveCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HiringDrive.
     * @param {HiringDriveDeleteArgs} args - Arguments to delete one HiringDrive.
     * @example
     * // Delete one HiringDrive
     * const HiringDrive = await prisma.hiringDrive.delete({
     *   where: {
     *     // ... filter to delete one HiringDrive
     *   }
     * })
     * 
     */
    delete<T extends HiringDriveDeleteArgs>(args: SelectSubset<T, HiringDriveDeleteArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HiringDrive.
     * @param {HiringDriveUpdateArgs} args - Arguments to update one HiringDrive.
     * @example
     * // Update one HiringDrive
     * const hiringDrive = await prisma.hiringDrive.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HiringDriveUpdateArgs>(args: SelectSubset<T, HiringDriveUpdateArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HiringDrives.
     * @param {HiringDriveDeleteManyArgs} args - Arguments to filter HiringDrives to delete.
     * @example
     * // Delete a few HiringDrives
     * const { count } = await prisma.hiringDrive.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HiringDriveDeleteManyArgs>(args?: SelectSubset<T, HiringDriveDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HiringDrives.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HiringDriveUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HiringDrives
     * const hiringDrive = await prisma.hiringDrive.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HiringDriveUpdateManyArgs>(args: SelectSubset<T, HiringDriveUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HiringDrives and returns the data updated in the database.
     * @param {HiringDriveUpdateManyAndReturnArgs} args - Arguments to update many HiringDrives.
     * @example
     * // Update many HiringDrives
     * const hiringDrive = await prisma.hiringDrive.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HiringDrives and only return the `id`
     * const hiringDriveWithIdOnly = await prisma.hiringDrive.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HiringDriveUpdateManyAndReturnArgs>(args: SelectSubset<T, HiringDriveUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HiringDrive.
     * @param {HiringDriveUpsertArgs} args - Arguments to update or create a HiringDrive.
     * @example
     * // Update or create a HiringDrive
     * const hiringDrive = await prisma.hiringDrive.upsert({
     *   create: {
     *     // ... data to create a HiringDrive
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HiringDrive we want to update
     *   }
     * })
     */
    upsert<T extends HiringDriveUpsertArgs>(args: SelectSubset<T, HiringDriveUpsertArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HiringDrives.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HiringDriveCountArgs} args - Arguments to filter HiringDrives to count.
     * @example
     * // Count the number of HiringDrives
     * const count = await prisma.hiringDrive.count({
     *   where: {
     *     // ... the filter for the HiringDrives we want to count
     *   }
     * })
    **/
    count<T extends HiringDriveCountArgs>(
      args?: Subset<T, HiringDriveCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HiringDriveCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HiringDrive.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HiringDriveAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HiringDriveAggregateArgs>(args: Subset<T, HiringDriveAggregateArgs>): Prisma.PrismaPromise<GetHiringDriveAggregateType<T>>

    /**
     * Group by HiringDrive.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HiringDriveGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HiringDriveGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HiringDriveGroupByArgs['orderBy'] }
        : { orderBy?: HiringDriveGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HiringDriveGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHiringDriveGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HiringDrive model
   */
  readonly fields: HiringDriveFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HiringDrive.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HiringDriveClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organisation<T extends OrganisationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganisationDefaultArgs<ExtArgs>>): Prisma__OrganisationClient<$Result.GetResult<Prisma.$OrganisationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    candidates<T extends HiringDrive$candidatesArgs<ExtArgs> = {}>(args?: Subset<T, HiringDrive$candidatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HiringDrive model
   */
  interface HiringDriveFieldRefs {
    readonly id: FieldRef<"HiringDrive", 'String'>
    readonly role: FieldRef<"HiringDrive", 'String'>
    readonly description: FieldRef<"HiringDrive", 'String'>
    readonly isActive: FieldRef<"HiringDrive", 'Boolean'>
    readonly organisationId: FieldRef<"HiringDrive", 'String'>
    readonly createdAt: FieldRef<"HiringDrive", 'DateTime'>
    readonly updatedAt: FieldRef<"HiringDrive", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HiringDrive findUnique
   */
  export type HiringDriveFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * Filter, which HiringDrive to fetch.
     */
    where: HiringDriveWhereUniqueInput
  }

  /**
   * HiringDrive findUniqueOrThrow
   */
  export type HiringDriveFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * Filter, which HiringDrive to fetch.
     */
    where: HiringDriveWhereUniqueInput
  }

  /**
   * HiringDrive findFirst
   */
  export type HiringDriveFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * Filter, which HiringDrive to fetch.
     */
    where?: HiringDriveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HiringDrives to fetch.
     */
    orderBy?: HiringDriveOrderByWithRelationInput | HiringDriveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HiringDrives.
     */
    cursor?: HiringDriveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HiringDrives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HiringDrives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HiringDrives.
     */
    distinct?: HiringDriveScalarFieldEnum | HiringDriveScalarFieldEnum[]
  }

  /**
   * HiringDrive findFirstOrThrow
   */
  export type HiringDriveFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * Filter, which HiringDrive to fetch.
     */
    where?: HiringDriveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HiringDrives to fetch.
     */
    orderBy?: HiringDriveOrderByWithRelationInput | HiringDriveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HiringDrives.
     */
    cursor?: HiringDriveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HiringDrives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HiringDrives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HiringDrives.
     */
    distinct?: HiringDriveScalarFieldEnum | HiringDriveScalarFieldEnum[]
  }

  /**
   * HiringDrive findMany
   */
  export type HiringDriveFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * Filter, which HiringDrives to fetch.
     */
    where?: HiringDriveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HiringDrives to fetch.
     */
    orderBy?: HiringDriveOrderByWithRelationInput | HiringDriveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HiringDrives.
     */
    cursor?: HiringDriveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HiringDrives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HiringDrives.
     */
    skip?: number
    distinct?: HiringDriveScalarFieldEnum | HiringDriveScalarFieldEnum[]
  }

  /**
   * HiringDrive create
   */
  export type HiringDriveCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * The data needed to create a HiringDrive.
     */
    data: XOR<HiringDriveCreateInput, HiringDriveUncheckedCreateInput>
  }

  /**
   * HiringDrive createMany
   */
  export type HiringDriveCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HiringDrives.
     */
    data: HiringDriveCreateManyInput | HiringDriveCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HiringDrive createManyAndReturn
   */
  export type HiringDriveCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * The data used to create many HiringDrives.
     */
    data: HiringDriveCreateManyInput | HiringDriveCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HiringDrive update
   */
  export type HiringDriveUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * The data needed to update a HiringDrive.
     */
    data: XOR<HiringDriveUpdateInput, HiringDriveUncheckedUpdateInput>
    /**
     * Choose, which HiringDrive to update.
     */
    where: HiringDriveWhereUniqueInput
  }

  /**
   * HiringDrive updateMany
   */
  export type HiringDriveUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HiringDrives.
     */
    data: XOR<HiringDriveUpdateManyMutationInput, HiringDriveUncheckedUpdateManyInput>
    /**
     * Filter which HiringDrives to update
     */
    where?: HiringDriveWhereInput
    /**
     * Limit how many HiringDrives to update.
     */
    limit?: number
  }

  /**
   * HiringDrive updateManyAndReturn
   */
  export type HiringDriveUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * The data used to update HiringDrives.
     */
    data: XOR<HiringDriveUpdateManyMutationInput, HiringDriveUncheckedUpdateManyInput>
    /**
     * Filter which HiringDrives to update
     */
    where?: HiringDriveWhereInput
    /**
     * Limit how many HiringDrives to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HiringDrive upsert
   */
  export type HiringDriveUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * The filter to search for the HiringDrive to update in case it exists.
     */
    where: HiringDriveWhereUniqueInput
    /**
     * In case the HiringDrive found by the `where` argument doesn't exist, create a new HiringDrive with this data.
     */
    create: XOR<HiringDriveCreateInput, HiringDriveUncheckedCreateInput>
    /**
     * In case the HiringDrive was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HiringDriveUpdateInput, HiringDriveUncheckedUpdateInput>
  }

  /**
   * HiringDrive delete
   */
  export type HiringDriveDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
    /**
     * Filter which HiringDrive to delete.
     */
    where: HiringDriveWhereUniqueInput
  }

  /**
   * HiringDrive deleteMany
   */
  export type HiringDriveDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HiringDrives to delete
     */
    where?: HiringDriveWhereInput
    /**
     * Limit how many HiringDrives to delete.
     */
    limit?: number
  }

  /**
   * HiringDrive.candidates
   */
  export type HiringDrive$candidatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    where?: DriveCandidateWhereInput
    orderBy?: DriveCandidateOrderByWithRelationInput | DriveCandidateOrderByWithRelationInput[]
    cursor?: DriveCandidateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DriveCandidateScalarFieldEnum | DriveCandidateScalarFieldEnum[]
  }

  /**
   * HiringDrive without action
   */
  export type HiringDriveDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HiringDrive
     */
    select?: HiringDriveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HiringDrive
     */
    omit?: HiringDriveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HiringDriveInclude<ExtArgs> | null
  }


  /**
   * Model DriveCandidate
   */

  export type AggregateDriveCandidate = {
    _count: DriveCandidateCountAggregateOutputType | null
    _min: DriveCandidateMinAggregateOutputType | null
    _max: DriveCandidateMaxAggregateOutputType | null
  }

  export type DriveCandidateMinAggregateOutputType = {
    id: string | null
    email: string | null
    fullName: string | null
    token: string | null
    status: string | null
    hiringDriveId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DriveCandidateMaxAggregateOutputType = {
    id: string | null
    email: string | null
    fullName: string | null
    token: string | null
    status: string | null
    hiringDriveId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DriveCandidateCountAggregateOutputType = {
    id: number
    email: number
    fullName: number
    token: number
    status: number
    hiringDriveId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DriveCandidateMinAggregateInputType = {
    id?: true
    email?: true
    fullName?: true
    token?: true
    status?: true
    hiringDriveId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DriveCandidateMaxAggregateInputType = {
    id?: true
    email?: true
    fullName?: true
    token?: true
    status?: true
    hiringDriveId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DriveCandidateCountAggregateInputType = {
    id?: true
    email?: true
    fullName?: true
    token?: true
    status?: true
    hiringDriveId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DriveCandidateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriveCandidate to aggregate.
     */
    where?: DriveCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveCandidates to fetch.
     */
    orderBy?: DriveCandidateOrderByWithRelationInput | DriveCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DriveCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DriveCandidates
    **/
    _count?: true | DriveCandidateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DriveCandidateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DriveCandidateMaxAggregateInputType
  }

  export type GetDriveCandidateAggregateType<T extends DriveCandidateAggregateArgs> = {
        [P in keyof T & keyof AggregateDriveCandidate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDriveCandidate[P]>
      : GetScalarType<T[P], AggregateDriveCandidate[P]>
  }




  export type DriveCandidateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriveCandidateWhereInput
    orderBy?: DriveCandidateOrderByWithAggregationInput | DriveCandidateOrderByWithAggregationInput[]
    by: DriveCandidateScalarFieldEnum[] | DriveCandidateScalarFieldEnum
    having?: DriveCandidateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DriveCandidateCountAggregateInputType | true
    _min?: DriveCandidateMinAggregateInputType
    _max?: DriveCandidateMaxAggregateInputType
  }

  export type DriveCandidateGroupByOutputType = {
    id: string
    email: string
    fullName: string
    token: string
    status: string
    hiringDriveId: string
    createdAt: Date
    updatedAt: Date
    _count: DriveCandidateCountAggregateOutputType | null
    _min: DriveCandidateMinAggregateOutputType | null
    _max: DriveCandidateMaxAggregateOutputType | null
  }

  type GetDriveCandidateGroupByPayload<T extends DriveCandidateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DriveCandidateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DriveCandidateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DriveCandidateGroupByOutputType[P]>
            : GetScalarType<T[P], DriveCandidateGroupByOutputType[P]>
        }
      >
    >


  export type DriveCandidateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    fullName?: boolean
    token?: boolean
    status?: boolean
    hiringDriveId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hiringDrive?: boolean | HiringDriveDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driveCandidate"]>

  export type DriveCandidateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    fullName?: boolean
    token?: boolean
    status?: boolean
    hiringDriveId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hiringDrive?: boolean | HiringDriveDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driveCandidate"]>

  export type DriveCandidateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    fullName?: boolean
    token?: boolean
    status?: boolean
    hiringDriveId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hiringDrive?: boolean | HiringDriveDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driveCandidate"]>

  export type DriveCandidateSelectScalar = {
    id?: boolean
    email?: boolean
    fullName?: boolean
    token?: boolean
    status?: boolean
    hiringDriveId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DriveCandidateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "fullName" | "token" | "status" | "hiringDriveId" | "createdAt" | "updatedAt", ExtArgs["result"]["driveCandidate"]>
  export type DriveCandidateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hiringDrive?: boolean | HiringDriveDefaultArgs<ExtArgs>
  }
  export type DriveCandidateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hiringDrive?: boolean | HiringDriveDefaultArgs<ExtArgs>
  }
  export type DriveCandidateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hiringDrive?: boolean | HiringDriveDefaultArgs<ExtArgs>
  }

  export type $DriveCandidatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DriveCandidate"
    objects: {
      hiringDrive: Prisma.$HiringDrivePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      fullName: string
      token: string
      status: string
      hiringDriveId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["driveCandidate"]>
    composites: {}
  }

  type DriveCandidateGetPayload<S extends boolean | null | undefined | DriveCandidateDefaultArgs> = $Result.GetResult<Prisma.$DriveCandidatePayload, S>

  type DriveCandidateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DriveCandidateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DriveCandidateCountAggregateInputType | true
    }

  export interface DriveCandidateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DriveCandidate'], meta: { name: 'DriveCandidate' } }
    /**
     * Find zero or one DriveCandidate that matches the filter.
     * @param {DriveCandidateFindUniqueArgs} args - Arguments to find a DriveCandidate
     * @example
     * // Get one DriveCandidate
     * const driveCandidate = await prisma.driveCandidate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DriveCandidateFindUniqueArgs>(args: SelectSubset<T, DriveCandidateFindUniqueArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DriveCandidate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DriveCandidateFindUniqueOrThrowArgs} args - Arguments to find a DriveCandidate
     * @example
     * // Get one DriveCandidate
     * const driveCandidate = await prisma.driveCandidate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DriveCandidateFindUniqueOrThrowArgs>(args: SelectSubset<T, DriveCandidateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriveCandidate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveCandidateFindFirstArgs} args - Arguments to find a DriveCandidate
     * @example
     * // Get one DriveCandidate
     * const driveCandidate = await prisma.driveCandidate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DriveCandidateFindFirstArgs>(args?: SelectSubset<T, DriveCandidateFindFirstArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriveCandidate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveCandidateFindFirstOrThrowArgs} args - Arguments to find a DriveCandidate
     * @example
     * // Get one DriveCandidate
     * const driveCandidate = await prisma.driveCandidate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DriveCandidateFindFirstOrThrowArgs>(args?: SelectSubset<T, DriveCandidateFindFirstOrThrowArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DriveCandidates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveCandidateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DriveCandidates
     * const driveCandidates = await prisma.driveCandidate.findMany()
     * 
     * // Get first 10 DriveCandidates
     * const driveCandidates = await prisma.driveCandidate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const driveCandidateWithIdOnly = await prisma.driveCandidate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DriveCandidateFindManyArgs>(args?: SelectSubset<T, DriveCandidateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DriveCandidate.
     * @param {DriveCandidateCreateArgs} args - Arguments to create a DriveCandidate.
     * @example
     * // Create one DriveCandidate
     * const DriveCandidate = await prisma.driveCandidate.create({
     *   data: {
     *     // ... data to create a DriveCandidate
     *   }
     * })
     * 
     */
    create<T extends DriveCandidateCreateArgs>(args: SelectSubset<T, DriveCandidateCreateArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DriveCandidates.
     * @param {DriveCandidateCreateManyArgs} args - Arguments to create many DriveCandidates.
     * @example
     * // Create many DriveCandidates
     * const driveCandidate = await prisma.driveCandidate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DriveCandidateCreateManyArgs>(args?: SelectSubset<T, DriveCandidateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DriveCandidates and returns the data saved in the database.
     * @param {DriveCandidateCreateManyAndReturnArgs} args - Arguments to create many DriveCandidates.
     * @example
     * // Create many DriveCandidates
     * const driveCandidate = await prisma.driveCandidate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DriveCandidates and only return the `id`
     * const driveCandidateWithIdOnly = await prisma.driveCandidate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DriveCandidateCreateManyAndReturnArgs>(args?: SelectSubset<T, DriveCandidateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DriveCandidate.
     * @param {DriveCandidateDeleteArgs} args - Arguments to delete one DriveCandidate.
     * @example
     * // Delete one DriveCandidate
     * const DriveCandidate = await prisma.driveCandidate.delete({
     *   where: {
     *     // ... filter to delete one DriveCandidate
     *   }
     * })
     * 
     */
    delete<T extends DriveCandidateDeleteArgs>(args: SelectSubset<T, DriveCandidateDeleteArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DriveCandidate.
     * @param {DriveCandidateUpdateArgs} args - Arguments to update one DriveCandidate.
     * @example
     * // Update one DriveCandidate
     * const driveCandidate = await prisma.driveCandidate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DriveCandidateUpdateArgs>(args: SelectSubset<T, DriveCandidateUpdateArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DriveCandidates.
     * @param {DriveCandidateDeleteManyArgs} args - Arguments to filter DriveCandidates to delete.
     * @example
     * // Delete a few DriveCandidates
     * const { count } = await prisma.driveCandidate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DriveCandidateDeleteManyArgs>(args?: SelectSubset<T, DriveCandidateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriveCandidates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveCandidateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DriveCandidates
     * const driveCandidate = await prisma.driveCandidate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DriveCandidateUpdateManyArgs>(args: SelectSubset<T, DriveCandidateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriveCandidates and returns the data updated in the database.
     * @param {DriveCandidateUpdateManyAndReturnArgs} args - Arguments to update many DriveCandidates.
     * @example
     * // Update many DriveCandidates
     * const driveCandidate = await prisma.driveCandidate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DriveCandidates and only return the `id`
     * const driveCandidateWithIdOnly = await prisma.driveCandidate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DriveCandidateUpdateManyAndReturnArgs>(args: SelectSubset<T, DriveCandidateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DriveCandidate.
     * @param {DriveCandidateUpsertArgs} args - Arguments to update or create a DriveCandidate.
     * @example
     * // Update or create a DriveCandidate
     * const driveCandidate = await prisma.driveCandidate.upsert({
     *   create: {
     *     // ... data to create a DriveCandidate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DriveCandidate we want to update
     *   }
     * })
     */
    upsert<T extends DriveCandidateUpsertArgs>(args: SelectSubset<T, DriveCandidateUpsertArgs<ExtArgs>>): Prisma__DriveCandidateClient<$Result.GetResult<Prisma.$DriveCandidatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DriveCandidates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveCandidateCountArgs} args - Arguments to filter DriveCandidates to count.
     * @example
     * // Count the number of DriveCandidates
     * const count = await prisma.driveCandidate.count({
     *   where: {
     *     // ... the filter for the DriveCandidates we want to count
     *   }
     * })
    **/
    count<T extends DriveCandidateCountArgs>(
      args?: Subset<T, DriveCandidateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DriveCandidateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DriveCandidate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveCandidateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DriveCandidateAggregateArgs>(args: Subset<T, DriveCandidateAggregateArgs>): Prisma.PrismaPromise<GetDriveCandidateAggregateType<T>>

    /**
     * Group by DriveCandidate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriveCandidateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DriveCandidateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DriveCandidateGroupByArgs['orderBy'] }
        : { orderBy?: DriveCandidateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DriveCandidateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriveCandidateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DriveCandidate model
   */
  readonly fields: DriveCandidateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DriveCandidate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DriveCandidateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hiringDrive<T extends HiringDriveDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HiringDriveDefaultArgs<ExtArgs>>): Prisma__HiringDriveClient<$Result.GetResult<Prisma.$HiringDrivePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DriveCandidate model
   */
  interface DriveCandidateFieldRefs {
    readonly id: FieldRef<"DriveCandidate", 'String'>
    readonly email: FieldRef<"DriveCandidate", 'String'>
    readonly fullName: FieldRef<"DriveCandidate", 'String'>
    readonly token: FieldRef<"DriveCandidate", 'String'>
    readonly status: FieldRef<"DriveCandidate", 'String'>
    readonly hiringDriveId: FieldRef<"DriveCandidate", 'String'>
    readonly createdAt: FieldRef<"DriveCandidate", 'DateTime'>
    readonly updatedAt: FieldRef<"DriveCandidate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DriveCandidate findUnique
   */
  export type DriveCandidateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * Filter, which DriveCandidate to fetch.
     */
    where: DriveCandidateWhereUniqueInput
  }

  /**
   * DriveCandidate findUniqueOrThrow
   */
  export type DriveCandidateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * Filter, which DriveCandidate to fetch.
     */
    where: DriveCandidateWhereUniqueInput
  }

  /**
   * DriveCandidate findFirst
   */
  export type DriveCandidateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * Filter, which DriveCandidate to fetch.
     */
    where?: DriveCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveCandidates to fetch.
     */
    orderBy?: DriveCandidateOrderByWithRelationInput | DriveCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriveCandidates.
     */
    cursor?: DriveCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveCandidates.
     */
    distinct?: DriveCandidateScalarFieldEnum | DriveCandidateScalarFieldEnum[]
  }

  /**
   * DriveCandidate findFirstOrThrow
   */
  export type DriveCandidateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * Filter, which DriveCandidate to fetch.
     */
    where?: DriveCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveCandidates to fetch.
     */
    orderBy?: DriveCandidateOrderByWithRelationInput | DriveCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriveCandidates.
     */
    cursor?: DriveCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriveCandidates.
     */
    distinct?: DriveCandidateScalarFieldEnum | DriveCandidateScalarFieldEnum[]
  }

  /**
   * DriveCandidate findMany
   */
  export type DriveCandidateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * Filter, which DriveCandidates to fetch.
     */
    where?: DriveCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriveCandidates to fetch.
     */
    orderBy?: DriveCandidateOrderByWithRelationInput | DriveCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DriveCandidates.
     */
    cursor?: DriveCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriveCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriveCandidates.
     */
    skip?: number
    distinct?: DriveCandidateScalarFieldEnum | DriveCandidateScalarFieldEnum[]
  }

  /**
   * DriveCandidate create
   */
  export type DriveCandidateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * The data needed to create a DriveCandidate.
     */
    data: XOR<DriveCandidateCreateInput, DriveCandidateUncheckedCreateInput>
  }

  /**
   * DriveCandidate createMany
   */
  export type DriveCandidateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DriveCandidates.
     */
    data: DriveCandidateCreateManyInput | DriveCandidateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DriveCandidate createManyAndReturn
   */
  export type DriveCandidateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * The data used to create many DriveCandidates.
     */
    data: DriveCandidateCreateManyInput | DriveCandidateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriveCandidate update
   */
  export type DriveCandidateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * The data needed to update a DriveCandidate.
     */
    data: XOR<DriveCandidateUpdateInput, DriveCandidateUncheckedUpdateInput>
    /**
     * Choose, which DriveCandidate to update.
     */
    where: DriveCandidateWhereUniqueInput
  }

  /**
   * DriveCandidate updateMany
   */
  export type DriveCandidateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DriveCandidates.
     */
    data: XOR<DriveCandidateUpdateManyMutationInput, DriveCandidateUncheckedUpdateManyInput>
    /**
     * Filter which DriveCandidates to update
     */
    where?: DriveCandidateWhereInput
    /**
     * Limit how many DriveCandidates to update.
     */
    limit?: number
  }

  /**
   * DriveCandidate updateManyAndReturn
   */
  export type DriveCandidateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * The data used to update DriveCandidates.
     */
    data: XOR<DriveCandidateUpdateManyMutationInput, DriveCandidateUncheckedUpdateManyInput>
    /**
     * Filter which DriveCandidates to update
     */
    where?: DriveCandidateWhereInput
    /**
     * Limit how many DriveCandidates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriveCandidate upsert
   */
  export type DriveCandidateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * The filter to search for the DriveCandidate to update in case it exists.
     */
    where: DriveCandidateWhereUniqueInput
    /**
     * In case the DriveCandidate found by the `where` argument doesn't exist, create a new DriveCandidate with this data.
     */
    create: XOR<DriveCandidateCreateInput, DriveCandidateUncheckedCreateInput>
    /**
     * In case the DriveCandidate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DriveCandidateUpdateInput, DriveCandidateUncheckedUpdateInput>
  }

  /**
   * DriveCandidate delete
   */
  export type DriveCandidateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
    /**
     * Filter which DriveCandidate to delete.
     */
    where: DriveCandidateWhereUniqueInput
  }

  /**
   * DriveCandidate deleteMany
   */
  export type DriveCandidateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriveCandidates to delete
     */
    where?: DriveCandidateWhereInput
    /**
     * Limit how many DriveCandidates to delete.
     */
    limit?: number
  }

  /**
   * DriveCandidate without action
   */
  export type DriveCandidateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriveCandidate
     */
    select?: DriveCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriveCandidate
     */
    omit?: DriveCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriveCandidateInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
    passwordHash: 'passwordHash',
    supabaseUserId: 'supabaseUserId',
    oauthProvider: 'oauthProvider',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    organisationId: 'organisationId',
    organisationRole: 'organisationRole'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OrganisationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
    orgCode: 'orgCode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrganisationScalarFieldEnum = (typeof OrganisationScalarFieldEnum)[keyof typeof OrganisationScalarFieldEnum]


  export const HiringDriveScalarFieldEnum: {
    id: 'id',
    role: 'role',
    description: 'description',
    isActive: 'isActive',
    organisationId: 'organisationId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HiringDriveScalarFieldEnum = (typeof HiringDriveScalarFieldEnum)[keyof typeof HiringDriveScalarFieldEnum]


  export const DriveCandidateScalarFieldEnum: {
    id: 'id',
    email: 'email',
    fullName: 'fullName',
    token: 'token',
    status: 'status',
    hiringDriveId: 'hiringDriveId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DriveCandidateScalarFieldEnum = (typeof DriveCandidateScalarFieldEnum)[keyof typeof DriveCandidateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    supabaseUserId?: StringNullableFilter<"User"> | string | null
    oauthProvider?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organisationId?: StringNullableFilter<"User"> | string | null
    organisationRole?: StringNullableFilter<"User"> | string | null
    organisation?: XOR<OrganisationNullableScalarRelationFilter, OrganisationWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    supabaseUserId?: SortOrderInput | SortOrder
    oauthProvider?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organisationId?: SortOrderInput | SortOrder
    organisationRole?: SortOrderInput | SortOrder
    organisation?: OrganisationOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    supabaseUserId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    oauthProvider?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organisationId?: StringNullableFilter<"User"> | string | null
    organisationRole?: StringNullableFilter<"User"> | string | null
    organisation?: XOR<OrganisationNullableScalarRelationFilter, OrganisationWhereInput> | null
  }, "id" | "email" | "supabaseUserId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    supabaseUserId?: SortOrderInput | SortOrder
    oauthProvider?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organisationId?: SortOrderInput | SortOrder
    organisationRole?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    supabaseUserId?: StringNullableWithAggregatesFilter<"User"> | string | null
    oauthProvider?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    organisationId?: StringNullableWithAggregatesFilter<"User"> | string | null
    organisationRole?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type OrganisationWhereInput = {
    AND?: OrganisationWhereInput | OrganisationWhereInput[]
    OR?: OrganisationWhereInput[]
    NOT?: OrganisationWhereInput | OrganisationWhereInput[]
    id?: StringFilter<"Organisation"> | string
    name?: StringFilter<"Organisation"> | string
    description?: StringNullableFilter<"Organisation"> | string | null
    category?: StringFilter<"Organisation"> | string
    orgCode?: StringFilter<"Organisation"> | string
    createdAt?: DateTimeFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeFilter<"Organisation"> | Date | string
    members?: UserListRelationFilter
    drives?: HiringDriveListRelationFilter
  }

  export type OrganisationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    orgCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: UserOrderByRelationAggregateInput
    drives?: HiringDriveOrderByRelationAggregateInput
  }

  export type OrganisationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orgCode?: string
    AND?: OrganisationWhereInput | OrganisationWhereInput[]
    OR?: OrganisationWhereInput[]
    NOT?: OrganisationWhereInput | OrganisationWhereInput[]
    name?: StringFilter<"Organisation"> | string
    description?: StringNullableFilter<"Organisation"> | string | null
    category?: StringFilter<"Organisation"> | string
    createdAt?: DateTimeFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeFilter<"Organisation"> | Date | string
    members?: UserListRelationFilter
    drives?: HiringDriveListRelationFilter
  }, "id" | "orgCode">

  export type OrganisationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    orgCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrganisationCountOrderByAggregateInput
    _max?: OrganisationMaxOrderByAggregateInput
    _min?: OrganisationMinOrderByAggregateInput
  }

  export type OrganisationScalarWhereWithAggregatesInput = {
    AND?: OrganisationScalarWhereWithAggregatesInput | OrganisationScalarWhereWithAggregatesInput[]
    OR?: OrganisationScalarWhereWithAggregatesInput[]
    NOT?: OrganisationScalarWhereWithAggregatesInput | OrganisationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organisation"> | string
    name?: StringWithAggregatesFilter<"Organisation"> | string
    description?: StringNullableWithAggregatesFilter<"Organisation"> | string | null
    category?: StringWithAggregatesFilter<"Organisation"> | string
    orgCode?: StringWithAggregatesFilter<"Organisation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Organisation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Organisation"> | Date | string
  }

  export type HiringDriveWhereInput = {
    AND?: HiringDriveWhereInput | HiringDriveWhereInput[]
    OR?: HiringDriveWhereInput[]
    NOT?: HiringDriveWhereInput | HiringDriveWhereInput[]
    id?: StringFilter<"HiringDrive"> | string
    role?: StringFilter<"HiringDrive"> | string
    description?: StringNullableFilter<"HiringDrive"> | string | null
    isActive?: BoolFilter<"HiringDrive"> | boolean
    organisationId?: StringFilter<"HiringDrive"> | string
    createdAt?: DateTimeFilter<"HiringDrive"> | Date | string
    updatedAt?: DateTimeFilter<"HiringDrive"> | Date | string
    organisation?: XOR<OrganisationScalarRelationFilter, OrganisationWhereInput>
    candidates?: DriveCandidateListRelationFilter
  }

  export type HiringDriveOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    organisationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organisation?: OrganisationOrderByWithRelationInput
    candidates?: DriveCandidateOrderByRelationAggregateInput
  }

  export type HiringDriveWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HiringDriveWhereInput | HiringDriveWhereInput[]
    OR?: HiringDriveWhereInput[]
    NOT?: HiringDriveWhereInput | HiringDriveWhereInput[]
    role?: StringFilter<"HiringDrive"> | string
    description?: StringNullableFilter<"HiringDrive"> | string | null
    isActive?: BoolFilter<"HiringDrive"> | boolean
    organisationId?: StringFilter<"HiringDrive"> | string
    createdAt?: DateTimeFilter<"HiringDrive"> | Date | string
    updatedAt?: DateTimeFilter<"HiringDrive"> | Date | string
    organisation?: XOR<OrganisationScalarRelationFilter, OrganisationWhereInput>
    candidates?: DriveCandidateListRelationFilter
  }, "id">

  export type HiringDriveOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    organisationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HiringDriveCountOrderByAggregateInput
    _max?: HiringDriveMaxOrderByAggregateInput
    _min?: HiringDriveMinOrderByAggregateInput
  }

  export type HiringDriveScalarWhereWithAggregatesInput = {
    AND?: HiringDriveScalarWhereWithAggregatesInput | HiringDriveScalarWhereWithAggregatesInput[]
    OR?: HiringDriveScalarWhereWithAggregatesInput[]
    NOT?: HiringDriveScalarWhereWithAggregatesInput | HiringDriveScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HiringDrive"> | string
    role?: StringWithAggregatesFilter<"HiringDrive"> | string
    description?: StringNullableWithAggregatesFilter<"HiringDrive"> | string | null
    isActive?: BoolWithAggregatesFilter<"HiringDrive"> | boolean
    organisationId?: StringWithAggregatesFilter<"HiringDrive"> | string
    createdAt?: DateTimeWithAggregatesFilter<"HiringDrive"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"HiringDrive"> | Date | string
  }

  export type DriveCandidateWhereInput = {
    AND?: DriveCandidateWhereInput | DriveCandidateWhereInput[]
    OR?: DriveCandidateWhereInput[]
    NOT?: DriveCandidateWhereInput | DriveCandidateWhereInput[]
    id?: StringFilter<"DriveCandidate"> | string
    email?: StringFilter<"DriveCandidate"> | string
    fullName?: StringFilter<"DriveCandidate"> | string
    token?: StringFilter<"DriveCandidate"> | string
    status?: StringFilter<"DriveCandidate"> | string
    hiringDriveId?: StringFilter<"DriveCandidate"> | string
    createdAt?: DateTimeFilter<"DriveCandidate"> | Date | string
    updatedAt?: DateTimeFilter<"DriveCandidate"> | Date | string
    hiringDrive?: XOR<HiringDriveScalarRelationFilter, HiringDriveWhereInput>
  }

  export type DriveCandidateOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    token?: SortOrder
    status?: SortOrder
    hiringDriveId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hiringDrive?: HiringDriveOrderByWithRelationInput
  }

  export type DriveCandidateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    email_hiringDriveId?: DriveCandidateEmailHiringDriveIdCompoundUniqueInput
    AND?: DriveCandidateWhereInput | DriveCandidateWhereInput[]
    OR?: DriveCandidateWhereInput[]
    NOT?: DriveCandidateWhereInput | DriveCandidateWhereInput[]
    email?: StringFilter<"DriveCandidate"> | string
    fullName?: StringFilter<"DriveCandidate"> | string
    status?: StringFilter<"DriveCandidate"> | string
    hiringDriveId?: StringFilter<"DriveCandidate"> | string
    createdAt?: DateTimeFilter<"DriveCandidate"> | Date | string
    updatedAt?: DateTimeFilter<"DriveCandidate"> | Date | string
    hiringDrive?: XOR<HiringDriveScalarRelationFilter, HiringDriveWhereInput>
  }, "id" | "token" | "email_hiringDriveId">

  export type DriveCandidateOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    token?: SortOrder
    status?: SortOrder
    hiringDriveId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DriveCandidateCountOrderByAggregateInput
    _max?: DriveCandidateMaxOrderByAggregateInput
    _min?: DriveCandidateMinOrderByAggregateInput
  }

  export type DriveCandidateScalarWhereWithAggregatesInput = {
    AND?: DriveCandidateScalarWhereWithAggregatesInput | DriveCandidateScalarWhereWithAggregatesInput[]
    OR?: DriveCandidateScalarWhereWithAggregatesInput[]
    NOT?: DriveCandidateScalarWhereWithAggregatesInput | DriveCandidateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DriveCandidate"> | string
    email?: StringWithAggregatesFilter<"DriveCandidate"> | string
    fullName?: StringWithAggregatesFilter<"DriveCandidate"> | string
    token?: StringWithAggregatesFilter<"DriveCandidate"> | string
    status?: StringWithAggregatesFilter<"DriveCandidate"> | string
    hiringDriveId?: StringWithAggregatesFilter<"DriveCandidate"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DriveCandidate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DriveCandidate"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    fullName: string
    email: string
    passwordHash?: string | null
    supabaseUserId?: string | null
    oauthProvider?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisationRole?: string | null
    organisation?: OrganisationCreateNestedOneWithoutMembersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    fullName: string
    email: string
    passwordHash?: string | null
    supabaseUserId?: string | null
    oauthProvider?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisationId?: string | null
    organisationRole?: string | null
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    supabaseUserId?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisationRole?: NullableStringFieldUpdateOperationsInput | string | null
    organisation?: OrganisationUpdateOneWithoutMembersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    supabaseUserId?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisationId?: NullableStringFieldUpdateOperationsInput | string | null
    organisationRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyInput = {
    id?: string
    fullName: string
    email: string
    passwordHash?: string | null
    supabaseUserId?: string | null
    oauthProvider?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisationId?: string | null
    organisationRole?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    supabaseUserId?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisationRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    supabaseUserId?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisationId?: NullableStringFieldUpdateOperationsInput | string | null
    organisationRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrganisationCreateInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    orgCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: UserCreateNestedManyWithoutOrganisationInput
    drives?: HiringDriveCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    orgCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: UserUncheckedCreateNestedManyWithoutOrganisationInput
    drives?: HiringDriveUncheckedCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: UserUpdateManyWithoutOrganisationNestedInput
    drives?: HiringDriveUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: UserUncheckedUpdateManyWithoutOrganisationNestedInput
    drives?: HiringDriveUncheckedUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    orgCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganisationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganisationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HiringDriveCreateInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisation: OrganisationCreateNestedOneWithoutDrivesInput
    candidates?: DriveCandidateCreateNestedManyWithoutHiringDriveInput
  }

  export type HiringDriveUncheckedCreateInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    organisationId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    candidates?: DriveCandidateUncheckedCreateNestedManyWithoutHiringDriveInput
  }

  export type HiringDriveUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisation?: OrganisationUpdateOneRequiredWithoutDrivesNestedInput
    candidates?: DriveCandidateUpdateManyWithoutHiringDriveNestedInput
  }

  export type HiringDriveUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    organisationId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidates?: DriveCandidateUncheckedUpdateManyWithoutHiringDriveNestedInput
  }

  export type HiringDriveCreateManyInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    organisationId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HiringDriveUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HiringDriveUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    organisationId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveCandidateCreateInput = {
    id?: string
    email: string
    fullName: string
    token: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    hiringDrive: HiringDriveCreateNestedOneWithoutCandidatesInput
  }

  export type DriveCandidateUncheckedCreateInput = {
    id?: string
    email: string
    fullName: string
    token: string
    status?: string
    hiringDriveId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriveCandidateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiringDrive?: HiringDriveUpdateOneRequiredWithoutCandidatesNestedInput
  }

  export type DriveCandidateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    hiringDriveId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveCandidateCreateManyInput = {
    id?: string
    email: string
    fullName: string
    token: string
    status?: string
    hiringDriveId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriveCandidateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveCandidateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    hiringDriveId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OrganisationNullableScalarRelationFilter = {
    is?: OrganisationWhereInput | null
    isNot?: OrganisationWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    supabaseUserId?: SortOrder
    oauthProvider?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organisationId?: SortOrder
    organisationRole?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    supabaseUserId?: SortOrder
    oauthProvider?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organisationId?: SortOrder
    organisationRole?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    supabaseUserId?: SortOrder
    oauthProvider?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organisationId?: SortOrder
    organisationRole?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type HiringDriveListRelationFilter = {
    every?: HiringDriveWhereInput
    some?: HiringDriveWhereInput
    none?: HiringDriveWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HiringDriveOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganisationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    orgCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    orgCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    orgCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationScalarRelationFilter = {
    is?: OrganisationWhereInput
    isNot?: OrganisationWhereInput
  }

  export type DriveCandidateListRelationFilter = {
    every?: DriveCandidateWhereInput
    some?: DriveCandidateWhereInput
    none?: DriveCandidateWhereInput
  }

  export type DriveCandidateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HiringDriveCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    organisationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HiringDriveMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    organisationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HiringDriveMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    organisationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HiringDriveScalarRelationFilter = {
    is?: HiringDriveWhereInput
    isNot?: HiringDriveWhereInput
  }

  export type DriveCandidateEmailHiringDriveIdCompoundUniqueInput = {
    email: string
    hiringDriveId: string
  }

  export type DriveCandidateCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    token?: SortOrder
    status?: SortOrder
    hiringDriveId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DriveCandidateMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    token?: SortOrder
    status?: SortOrder
    hiringDriveId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DriveCandidateMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    fullName?: SortOrder
    token?: SortOrder
    status?: SortOrder
    hiringDriveId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganisationCreateNestedOneWithoutMembersInput = {
    create?: XOR<OrganisationCreateWithoutMembersInput, OrganisationUncheckedCreateWithoutMembersInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutMembersInput
    connect?: OrganisationWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrganisationUpdateOneWithoutMembersNestedInput = {
    create?: XOR<OrganisationCreateWithoutMembersInput, OrganisationUncheckedCreateWithoutMembersInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutMembersInput
    upsert?: OrganisationUpsertWithoutMembersInput
    disconnect?: OrganisationWhereInput | boolean
    delete?: OrganisationWhereInput | boolean
    connect?: OrganisationWhereUniqueInput
    update?: XOR<XOR<OrganisationUpdateToOneWithWhereWithoutMembersInput, OrganisationUpdateWithoutMembersInput>, OrganisationUncheckedUpdateWithoutMembersInput>
  }

  export type UserCreateNestedManyWithoutOrganisationInput = {
    create?: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput> | UserCreateWithoutOrganisationInput[] | UserUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganisationInput | UserCreateOrConnectWithoutOrganisationInput[]
    createMany?: UserCreateManyOrganisationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type HiringDriveCreateNestedManyWithoutOrganisationInput = {
    create?: XOR<HiringDriveCreateWithoutOrganisationInput, HiringDriveUncheckedCreateWithoutOrganisationInput> | HiringDriveCreateWithoutOrganisationInput[] | HiringDriveUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: HiringDriveCreateOrConnectWithoutOrganisationInput | HiringDriveCreateOrConnectWithoutOrganisationInput[]
    createMany?: HiringDriveCreateManyOrganisationInputEnvelope
    connect?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOrganisationInput = {
    create?: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput> | UserCreateWithoutOrganisationInput[] | UserUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganisationInput | UserCreateOrConnectWithoutOrganisationInput[]
    createMany?: UserCreateManyOrganisationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type HiringDriveUncheckedCreateNestedManyWithoutOrganisationInput = {
    create?: XOR<HiringDriveCreateWithoutOrganisationInput, HiringDriveUncheckedCreateWithoutOrganisationInput> | HiringDriveCreateWithoutOrganisationInput[] | HiringDriveUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: HiringDriveCreateOrConnectWithoutOrganisationInput | HiringDriveCreateOrConnectWithoutOrganisationInput[]
    createMany?: HiringDriveCreateManyOrganisationInputEnvelope
    connect?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutOrganisationNestedInput = {
    create?: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput> | UserCreateWithoutOrganisationInput[] | UserUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganisationInput | UserCreateOrConnectWithoutOrganisationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganisationInput | UserUpsertWithWhereUniqueWithoutOrganisationInput[]
    createMany?: UserCreateManyOrganisationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganisationInput | UserUpdateWithWhereUniqueWithoutOrganisationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganisationInput | UserUpdateManyWithWhereWithoutOrganisationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type HiringDriveUpdateManyWithoutOrganisationNestedInput = {
    create?: XOR<HiringDriveCreateWithoutOrganisationInput, HiringDriveUncheckedCreateWithoutOrganisationInput> | HiringDriveCreateWithoutOrganisationInput[] | HiringDriveUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: HiringDriveCreateOrConnectWithoutOrganisationInput | HiringDriveCreateOrConnectWithoutOrganisationInput[]
    upsert?: HiringDriveUpsertWithWhereUniqueWithoutOrganisationInput | HiringDriveUpsertWithWhereUniqueWithoutOrganisationInput[]
    createMany?: HiringDriveCreateManyOrganisationInputEnvelope
    set?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    disconnect?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    delete?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    connect?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    update?: HiringDriveUpdateWithWhereUniqueWithoutOrganisationInput | HiringDriveUpdateWithWhereUniqueWithoutOrganisationInput[]
    updateMany?: HiringDriveUpdateManyWithWhereWithoutOrganisationInput | HiringDriveUpdateManyWithWhereWithoutOrganisationInput[]
    deleteMany?: HiringDriveScalarWhereInput | HiringDriveScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutOrganisationNestedInput = {
    create?: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput> | UserCreateWithoutOrganisationInput[] | UserUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganisationInput | UserCreateOrConnectWithoutOrganisationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganisationInput | UserUpsertWithWhereUniqueWithoutOrganisationInput[]
    createMany?: UserCreateManyOrganisationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganisationInput | UserUpdateWithWhereUniqueWithoutOrganisationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganisationInput | UserUpdateManyWithWhereWithoutOrganisationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type HiringDriveUncheckedUpdateManyWithoutOrganisationNestedInput = {
    create?: XOR<HiringDriveCreateWithoutOrganisationInput, HiringDriveUncheckedCreateWithoutOrganisationInput> | HiringDriveCreateWithoutOrganisationInput[] | HiringDriveUncheckedCreateWithoutOrganisationInput[]
    connectOrCreate?: HiringDriveCreateOrConnectWithoutOrganisationInput | HiringDriveCreateOrConnectWithoutOrganisationInput[]
    upsert?: HiringDriveUpsertWithWhereUniqueWithoutOrganisationInput | HiringDriveUpsertWithWhereUniqueWithoutOrganisationInput[]
    createMany?: HiringDriveCreateManyOrganisationInputEnvelope
    set?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    disconnect?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    delete?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    connect?: HiringDriveWhereUniqueInput | HiringDriveWhereUniqueInput[]
    update?: HiringDriveUpdateWithWhereUniqueWithoutOrganisationInput | HiringDriveUpdateWithWhereUniqueWithoutOrganisationInput[]
    updateMany?: HiringDriveUpdateManyWithWhereWithoutOrganisationInput | HiringDriveUpdateManyWithWhereWithoutOrganisationInput[]
    deleteMany?: HiringDriveScalarWhereInput | HiringDriveScalarWhereInput[]
  }

  export type OrganisationCreateNestedOneWithoutDrivesInput = {
    create?: XOR<OrganisationCreateWithoutDrivesInput, OrganisationUncheckedCreateWithoutDrivesInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutDrivesInput
    connect?: OrganisationWhereUniqueInput
  }

  export type DriveCandidateCreateNestedManyWithoutHiringDriveInput = {
    create?: XOR<DriveCandidateCreateWithoutHiringDriveInput, DriveCandidateUncheckedCreateWithoutHiringDriveInput> | DriveCandidateCreateWithoutHiringDriveInput[] | DriveCandidateUncheckedCreateWithoutHiringDriveInput[]
    connectOrCreate?: DriveCandidateCreateOrConnectWithoutHiringDriveInput | DriveCandidateCreateOrConnectWithoutHiringDriveInput[]
    createMany?: DriveCandidateCreateManyHiringDriveInputEnvelope
    connect?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
  }

  export type DriveCandidateUncheckedCreateNestedManyWithoutHiringDriveInput = {
    create?: XOR<DriveCandidateCreateWithoutHiringDriveInput, DriveCandidateUncheckedCreateWithoutHiringDriveInput> | DriveCandidateCreateWithoutHiringDriveInput[] | DriveCandidateUncheckedCreateWithoutHiringDriveInput[]
    connectOrCreate?: DriveCandidateCreateOrConnectWithoutHiringDriveInput | DriveCandidateCreateOrConnectWithoutHiringDriveInput[]
    createMany?: DriveCandidateCreateManyHiringDriveInputEnvelope
    connect?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
  }

  export type OrganisationUpdateOneRequiredWithoutDrivesNestedInput = {
    create?: XOR<OrganisationCreateWithoutDrivesInput, OrganisationUncheckedCreateWithoutDrivesInput>
    connectOrCreate?: OrganisationCreateOrConnectWithoutDrivesInput
    upsert?: OrganisationUpsertWithoutDrivesInput
    connect?: OrganisationWhereUniqueInput
    update?: XOR<XOR<OrganisationUpdateToOneWithWhereWithoutDrivesInput, OrganisationUpdateWithoutDrivesInput>, OrganisationUncheckedUpdateWithoutDrivesInput>
  }

  export type DriveCandidateUpdateManyWithoutHiringDriveNestedInput = {
    create?: XOR<DriveCandidateCreateWithoutHiringDriveInput, DriveCandidateUncheckedCreateWithoutHiringDriveInput> | DriveCandidateCreateWithoutHiringDriveInput[] | DriveCandidateUncheckedCreateWithoutHiringDriveInput[]
    connectOrCreate?: DriveCandidateCreateOrConnectWithoutHiringDriveInput | DriveCandidateCreateOrConnectWithoutHiringDriveInput[]
    upsert?: DriveCandidateUpsertWithWhereUniqueWithoutHiringDriveInput | DriveCandidateUpsertWithWhereUniqueWithoutHiringDriveInput[]
    createMany?: DriveCandidateCreateManyHiringDriveInputEnvelope
    set?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    disconnect?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    delete?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    connect?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    update?: DriveCandidateUpdateWithWhereUniqueWithoutHiringDriveInput | DriveCandidateUpdateWithWhereUniqueWithoutHiringDriveInput[]
    updateMany?: DriveCandidateUpdateManyWithWhereWithoutHiringDriveInput | DriveCandidateUpdateManyWithWhereWithoutHiringDriveInput[]
    deleteMany?: DriveCandidateScalarWhereInput | DriveCandidateScalarWhereInput[]
  }

  export type DriveCandidateUncheckedUpdateManyWithoutHiringDriveNestedInput = {
    create?: XOR<DriveCandidateCreateWithoutHiringDriveInput, DriveCandidateUncheckedCreateWithoutHiringDriveInput> | DriveCandidateCreateWithoutHiringDriveInput[] | DriveCandidateUncheckedCreateWithoutHiringDriveInput[]
    connectOrCreate?: DriveCandidateCreateOrConnectWithoutHiringDriveInput | DriveCandidateCreateOrConnectWithoutHiringDriveInput[]
    upsert?: DriveCandidateUpsertWithWhereUniqueWithoutHiringDriveInput | DriveCandidateUpsertWithWhereUniqueWithoutHiringDriveInput[]
    createMany?: DriveCandidateCreateManyHiringDriveInputEnvelope
    set?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    disconnect?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    delete?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    connect?: DriveCandidateWhereUniqueInput | DriveCandidateWhereUniqueInput[]
    update?: DriveCandidateUpdateWithWhereUniqueWithoutHiringDriveInput | DriveCandidateUpdateWithWhereUniqueWithoutHiringDriveInput[]
    updateMany?: DriveCandidateUpdateManyWithWhereWithoutHiringDriveInput | DriveCandidateUpdateManyWithWhereWithoutHiringDriveInput[]
    deleteMany?: DriveCandidateScalarWhereInput | DriveCandidateScalarWhereInput[]
  }

  export type HiringDriveCreateNestedOneWithoutCandidatesInput = {
    create?: XOR<HiringDriveCreateWithoutCandidatesInput, HiringDriveUncheckedCreateWithoutCandidatesInput>
    connectOrCreate?: HiringDriveCreateOrConnectWithoutCandidatesInput
    connect?: HiringDriveWhereUniqueInput
  }

  export type HiringDriveUpdateOneRequiredWithoutCandidatesNestedInput = {
    create?: XOR<HiringDriveCreateWithoutCandidatesInput, HiringDriveUncheckedCreateWithoutCandidatesInput>
    connectOrCreate?: HiringDriveCreateOrConnectWithoutCandidatesInput
    upsert?: HiringDriveUpsertWithoutCandidatesInput
    connect?: HiringDriveWhereUniqueInput
    update?: XOR<XOR<HiringDriveUpdateToOneWithWhereWithoutCandidatesInput, HiringDriveUpdateWithoutCandidatesInput>, HiringDriveUncheckedUpdateWithoutCandidatesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OrganisationCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    orgCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    drives?: HiringDriveCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    orgCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    drives?: HiringDriveUncheckedCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationCreateOrConnectWithoutMembersInput = {
    where: OrganisationWhereUniqueInput
    create: XOR<OrganisationCreateWithoutMembersInput, OrganisationUncheckedCreateWithoutMembersInput>
  }

  export type OrganisationUpsertWithoutMembersInput = {
    update: XOR<OrganisationUpdateWithoutMembersInput, OrganisationUncheckedUpdateWithoutMembersInput>
    create: XOR<OrganisationCreateWithoutMembersInput, OrganisationUncheckedCreateWithoutMembersInput>
    where?: OrganisationWhereInput
  }

  export type OrganisationUpdateToOneWithWhereWithoutMembersInput = {
    where?: OrganisationWhereInput
    data: XOR<OrganisationUpdateWithoutMembersInput, OrganisationUncheckedUpdateWithoutMembersInput>
  }

  export type OrganisationUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drives?: HiringDriveUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drives?: HiringDriveUncheckedUpdateManyWithoutOrganisationNestedInput
  }

  export type UserCreateWithoutOrganisationInput = {
    id?: string
    fullName: string
    email: string
    passwordHash?: string | null
    supabaseUserId?: string | null
    oauthProvider?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisationRole?: string | null
  }

  export type UserUncheckedCreateWithoutOrganisationInput = {
    id?: string
    fullName: string
    email: string
    passwordHash?: string | null
    supabaseUserId?: string | null
    oauthProvider?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisationRole?: string | null
  }

  export type UserCreateOrConnectWithoutOrganisationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput>
  }

  export type UserCreateManyOrganisationInputEnvelope = {
    data: UserCreateManyOrganisationInput | UserCreateManyOrganisationInput[]
    skipDuplicates?: boolean
  }

  export type HiringDriveCreateWithoutOrganisationInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    candidates?: DriveCandidateCreateNestedManyWithoutHiringDriveInput
  }

  export type HiringDriveUncheckedCreateWithoutOrganisationInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    candidates?: DriveCandidateUncheckedCreateNestedManyWithoutHiringDriveInput
  }

  export type HiringDriveCreateOrConnectWithoutOrganisationInput = {
    where: HiringDriveWhereUniqueInput
    create: XOR<HiringDriveCreateWithoutOrganisationInput, HiringDriveUncheckedCreateWithoutOrganisationInput>
  }

  export type HiringDriveCreateManyOrganisationInputEnvelope = {
    data: HiringDriveCreateManyOrganisationInput | HiringDriveCreateManyOrganisationInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutOrganisationInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOrganisationInput, UserUncheckedUpdateWithoutOrganisationInput>
    create: XOR<UserCreateWithoutOrganisationInput, UserUncheckedCreateWithoutOrganisationInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOrganisationInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOrganisationInput, UserUncheckedUpdateWithoutOrganisationInput>
  }

  export type UserUpdateManyWithWhereWithoutOrganisationInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOrganisationInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    supabaseUserId?: StringNullableFilter<"User"> | string | null
    oauthProvider?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organisationId?: StringNullableFilter<"User"> | string | null
    organisationRole?: StringNullableFilter<"User"> | string | null
  }

  export type HiringDriveUpsertWithWhereUniqueWithoutOrganisationInput = {
    where: HiringDriveWhereUniqueInput
    update: XOR<HiringDriveUpdateWithoutOrganisationInput, HiringDriveUncheckedUpdateWithoutOrganisationInput>
    create: XOR<HiringDriveCreateWithoutOrganisationInput, HiringDriveUncheckedCreateWithoutOrganisationInput>
  }

  export type HiringDriveUpdateWithWhereUniqueWithoutOrganisationInput = {
    where: HiringDriveWhereUniqueInput
    data: XOR<HiringDriveUpdateWithoutOrganisationInput, HiringDriveUncheckedUpdateWithoutOrganisationInput>
  }

  export type HiringDriveUpdateManyWithWhereWithoutOrganisationInput = {
    where: HiringDriveScalarWhereInput
    data: XOR<HiringDriveUpdateManyMutationInput, HiringDriveUncheckedUpdateManyWithoutOrganisationInput>
  }

  export type HiringDriveScalarWhereInput = {
    AND?: HiringDriveScalarWhereInput | HiringDriveScalarWhereInput[]
    OR?: HiringDriveScalarWhereInput[]
    NOT?: HiringDriveScalarWhereInput | HiringDriveScalarWhereInput[]
    id?: StringFilter<"HiringDrive"> | string
    role?: StringFilter<"HiringDrive"> | string
    description?: StringNullableFilter<"HiringDrive"> | string | null
    isActive?: BoolFilter<"HiringDrive"> | boolean
    organisationId?: StringFilter<"HiringDrive"> | string
    createdAt?: DateTimeFilter<"HiringDrive"> | Date | string
    updatedAt?: DateTimeFilter<"HiringDrive"> | Date | string
  }

  export type OrganisationCreateWithoutDrivesInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    orgCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: UserCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationUncheckedCreateWithoutDrivesInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    orgCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: UserUncheckedCreateNestedManyWithoutOrganisationInput
  }

  export type OrganisationCreateOrConnectWithoutDrivesInput = {
    where: OrganisationWhereUniqueInput
    create: XOR<OrganisationCreateWithoutDrivesInput, OrganisationUncheckedCreateWithoutDrivesInput>
  }

  export type DriveCandidateCreateWithoutHiringDriveInput = {
    id?: string
    email: string
    fullName: string
    token: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriveCandidateUncheckedCreateWithoutHiringDriveInput = {
    id?: string
    email: string
    fullName: string
    token: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriveCandidateCreateOrConnectWithoutHiringDriveInput = {
    where: DriveCandidateWhereUniqueInput
    create: XOR<DriveCandidateCreateWithoutHiringDriveInput, DriveCandidateUncheckedCreateWithoutHiringDriveInput>
  }

  export type DriveCandidateCreateManyHiringDriveInputEnvelope = {
    data: DriveCandidateCreateManyHiringDriveInput | DriveCandidateCreateManyHiringDriveInput[]
    skipDuplicates?: boolean
  }

  export type OrganisationUpsertWithoutDrivesInput = {
    update: XOR<OrganisationUpdateWithoutDrivesInput, OrganisationUncheckedUpdateWithoutDrivesInput>
    create: XOR<OrganisationCreateWithoutDrivesInput, OrganisationUncheckedCreateWithoutDrivesInput>
    where?: OrganisationWhereInput
  }

  export type OrganisationUpdateToOneWithWhereWithoutDrivesInput = {
    where?: OrganisationWhereInput
    data: XOR<OrganisationUpdateWithoutDrivesInput, OrganisationUncheckedUpdateWithoutDrivesInput>
  }

  export type OrganisationUpdateWithoutDrivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: UserUpdateManyWithoutOrganisationNestedInput
  }

  export type OrganisationUncheckedUpdateWithoutDrivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    orgCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: UserUncheckedUpdateManyWithoutOrganisationNestedInput
  }

  export type DriveCandidateUpsertWithWhereUniqueWithoutHiringDriveInput = {
    where: DriveCandidateWhereUniqueInput
    update: XOR<DriveCandidateUpdateWithoutHiringDriveInput, DriveCandidateUncheckedUpdateWithoutHiringDriveInput>
    create: XOR<DriveCandidateCreateWithoutHiringDriveInput, DriveCandidateUncheckedCreateWithoutHiringDriveInput>
  }

  export type DriveCandidateUpdateWithWhereUniqueWithoutHiringDriveInput = {
    where: DriveCandidateWhereUniqueInput
    data: XOR<DriveCandidateUpdateWithoutHiringDriveInput, DriveCandidateUncheckedUpdateWithoutHiringDriveInput>
  }

  export type DriveCandidateUpdateManyWithWhereWithoutHiringDriveInput = {
    where: DriveCandidateScalarWhereInput
    data: XOR<DriveCandidateUpdateManyMutationInput, DriveCandidateUncheckedUpdateManyWithoutHiringDriveInput>
  }

  export type DriveCandidateScalarWhereInput = {
    AND?: DriveCandidateScalarWhereInput | DriveCandidateScalarWhereInput[]
    OR?: DriveCandidateScalarWhereInput[]
    NOT?: DriveCandidateScalarWhereInput | DriveCandidateScalarWhereInput[]
    id?: StringFilter<"DriveCandidate"> | string
    email?: StringFilter<"DriveCandidate"> | string
    fullName?: StringFilter<"DriveCandidate"> | string
    token?: StringFilter<"DriveCandidate"> | string
    status?: StringFilter<"DriveCandidate"> | string
    hiringDriveId?: StringFilter<"DriveCandidate"> | string
    createdAt?: DateTimeFilter<"DriveCandidate"> | Date | string
    updatedAt?: DateTimeFilter<"DriveCandidate"> | Date | string
  }

  export type HiringDriveCreateWithoutCandidatesInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisation: OrganisationCreateNestedOneWithoutDrivesInput
  }

  export type HiringDriveUncheckedCreateWithoutCandidatesInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    organisationId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HiringDriveCreateOrConnectWithoutCandidatesInput = {
    where: HiringDriveWhereUniqueInput
    create: XOR<HiringDriveCreateWithoutCandidatesInput, HiringDriveUncheckedCreateWithoutCandidatesInput>
  }

  export type HiringDriveUpsertWithoutCandidatesInput = {
    update: XOR<HiringDriveUpdateWithoutCandidatesInput, HiringDriveUncheckedUpdateWithoutCandidatesInput>
    create: XOR<HiringDriveCreateWithoutCandidatesInput, HiringDriveUncheckedCreateWithoutCandidatesInput>
    where?: HiringDriveWhereInput
  }

  export type HiringDriveUpdateToOneWithWhereWithoutCandidatesInput = {
    where?: HiringDriveWhereInput
    data: XOR<HiringDriveUpdateWithoutCandidatesInput, HiringDriveUncheckedUpdateWithoutCandidatesInput>
  }

  export type HiringDriveUpdateWithoutCandidatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisation?: OrganisationUpdateOneRequiredWithoutDrivesNestedInput
  }

  export type HiringDriveUncheckedUpdateWithoutCandidatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    organisationId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyOrganisationInput = {
    id?: string
    fullName: string
    email: string
    passwordHash?: string | null
    supabaseUserId?: string | null
    oauthProvider?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    organisationRole?: string | null
  }

  export type HiringDriveCreateManyOrganisationInput = {
    id?: string
    role: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    supabaseUserId?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisationRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    supabaseUserId?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisationRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    supabaseUserId?: NullableStringFieldUpdateOperationsInput | string | null
    oauthProvider?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organisationRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type HiringDriveUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidates?: DriveCandidateUpdateManyWithoutHiringDriveNestedInput
  }

  export type HiringDriveUncheckedUpdateWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidates?: DriveCandidateUncheckedUpdateManyWithoutHiringDriveNestedInput
  }

  export type HiringDriveUncheckedUpdateManyWithoutOrganisationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveCandidateCreateManyHiringDriveInput = {
    id?: string
    email: string
    fullName: string
    token: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DriveCandidateUpdateWithoutHiringDriveInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveCandidateUncheckedUpdateWithoutHiringDriveInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriveCandidateUncheckedUpdateManyWithoutHiringDriveInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}