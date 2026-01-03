/**
 * The **Metatable** library enables advanced interaction with [metatables](https://create.roblox.com/docs/luau/metatables) in Luau. It provides direct access to core metamethods and internal table behaviours - including those normally protected or hidden via `__metatable` locks.
 * This library is especially useful when trying to modify or access hidden things within locked Roblox objects.
 * @see https://docs.sunc.su/Metatable
 */

/**
 * `getnamecallmethod` returns the name of the method that invoked the [`__namecall`](https://devforum.roblox.com/t/how-do-i-get-namecall-method/2848439/5) metamethod.
 * @returns The name of the method that was called via namecall, or `nil` if not in a namecall context.
 * @example
 * const refs: any = {};
 * refs.__namecall = hookmetamethod(game, "__namecall", (...args: Array<unknown>) => {
 *     const self = args[0];
 *     const method = getnamecallmethod();
 *     if (self === game && method === "service") {
 *         throw new Error("Using game:service() is not allowed.");
 *     }
 *     return refs.__namecall(...args);
 * });
 * @see https://docs.sunc.su/Metatable/getnamecallmethod
 */
declare function getnamecallmethod(): string | undefined;

/**
 * `getrawmetatable` returns the raw metatable of an object, even if that object has a `__metatable` field set.
 * @param object The object whose metatable to retrieve.
 * @returns The raw metatable of the object, or `nil` if it doesn't have one.
 * @example
 * const mt = getrawmetatable(game);
 * print(typeof mt); // Output: object
 * print(mt.__index(game, "Workspace")); // Output: Workspace
 * @see https://docs.sunc.su/Metatable/getrawmetatable
 */
declare function getrawmetatable(
  object: any,
): { [key: string]: any } | undefined;

/**
 * `isreadonly` checks whether a table is currently set as **readonly**.
 * @param table The table to check for readonly status.
 * @returns `true` if the table is readonly, otherwise `false`.
 * @example
 * print(isreadonly({})); // Output: false
 * print(isreadonly(getrawmetatable(game))); // Output: true
 * @see https://docs.sunc.su/Metatable/isreadonly
 */
declare function isreadonly(table: { [key: string]: any }): boolean;

/**
 * `setreadonly` sets whether a table is **readonly** or **writable**.
 * @param table The table whose readonly status you want to modify.
 * @param state `true` to lock the table, `false` to unlock it.
 * @example
 * const mt = getrawmetatable(game);
 * (mt as any).Example = "Hello"; // Throws an error
 * setreadonly(mt, false);
 * (mt as any).Example = "Hello";
 * print(mt.Example); // Output: Hello
 * setreadonly(mt, true); // Lock back
 * @see https://docs.sunc.su/Metatable/setreadonly
 */
declare function setreadonly(
  table: { [key: string]: any },
  state: boolean,
): void;

/**
 * `setrawmetatable` forcibly sets the metatable of a value, bypassing the `__metatable` protection field.
 * @param object The value whose metatable will be overwritten.
 * @param metatable The new metatable to assign.
 * @returns The original object with the new metatable set.
 * @example
 * const dummyString = "Example";
 * const stringMetatable = setrawmetatable(dummyString, {
 *     __index: getgenv()
 * });
 * print(stringMetatable);          // Output: Example
 * print(stringMetatable.getgenv);        // Output: function: 0x...
 * @see https://docs.sunc.su/Metatable/setrawmetatable
 */
declare function setrawmetatable<T>(
  object: T,
  metatable: { [key: string]: any },
): T;
