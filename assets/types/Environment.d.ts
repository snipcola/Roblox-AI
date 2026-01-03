/**
 * The **Environment** library allows access and inspection to our and Roblox's environment.
 * @see https://docs.sunc.su/Environment
 */

/**
 * `getgc` returns a list of **non-dead garbage-collectable values**. These include functions, userdatas, and optionally tables.
 * @param includeTables? If `true`, also includes tables in the returned list. Defaults to `false`.
 * @returns An array of garbage-collectable values.
 * @example
 * const dummyTable = {};
 * const dummyFunction = () => {};
 * task.wait(0.05); // Step a bit
 * for (const value of getgc()) {
 *     if (value === dummyFunction) {
 *         print(`Found function: ${dummyFunction}`);
 *     } else if (value === dummyTable) {
 *         print(`Found table?: ${dummyTable}`); // This shouldn't print
 *     }
 * }
 * @example
 * const dummyTable = {};
 * const dummyFunction = () => {};
 * task.wait(0.05); // Step a bit
 * for (const value of getgc(true)) {
 *     if (value === dummyFunction) {
 *         print(`Found function: ${dummyFunction}`); // Should print
 *     } else if (value === dummyTable) {
 *         print(`Found table: ${dummyTable}`); // Should also print
 *     }
 * }
 * @see https://docs.sunc.su/Environment/getgc
 */
declare function getgc(includeTables?: boolean): Array<any>;

/**
 * `filtergc` allows you to retrieve specific garbage-collected values from Luau's memory, using fine-tuned filters.
 * @param filterType The type of value to search for.
 * @param filterOptions A set of rules used to match functions or tables.
 * @param returnOne? If `true`, returns the first match, instead of a table of matches.
 * @returns Depending on `returnOne`, either a single value or an array of values.
 * @example
 * const dummyFunction = () => {};
 * const retrieved = filtergc("function", {
 *     Name: "dummyFunction",
 *     IgnoreExecutor: false
 * });
 * print(typeof retrieved); // Output: object
 * print(retrieved[0] === dummyFunction); // Output: true
 * @example
 * const dummyFunction = () => {};
 * const retrieved = filtergc("function", {
 *     Name: "dummyFunction",
 *     IgnoreExecutor: false
 * }, true);
 * print(typeof retrieved); // function
 * print(retrieved === dummyFunction); // true
 * @example
 * const dummyFunction = () => {
 *     return "Hello";
 * };
 * const dummyFunctionHash = getfunctionhash(dummyFunction);
 * const retrieved = filtergc("function", {
 *     Hash: dummyFunctionHash,
 *     IgnoreExecutor: false
 * }, true);
 * print(getfunctionhash(retrieved) === dummyFunctionHash); // true
 * print(retrieved === dummyFunction); // true
 * @example
 * let upvalue = 5;
 * const dummyFunction = () => {
 *     upvalue += 1;
 *     print(game.Players.LocalPlayer);
 * };
 * const retrieved = filtergc("function", {
 *     Constants: ["print", "game", "Players", "LocalPlayer", 1],
 *     Upvalues: [5],
 *     IgnoreExecutor: false
 * }, true);
 * print(retrieved === dummyFunction); // true
 * @example
 * const dummyTable = { dummy_key: "" };
 * const retrieved = filtergc("table", {
 *     Keys: ["dummy_key"],
 * }, true);
 * print(retrieved === dummyTable); // true
 * @example
 * const dummyTable = { dummy_key: "dummy_value" };
 * const retrieved = filtergc("table", {
 *     KeyValuePairs: { dummy_key: "dummy_value" },
 * }, true);
 * print(retrieved === dummyTable); // true
 * @example
 * const dummyTable = setmetatable({}, { __index: getgenv() });
 * const retrieved = filtergc("table", {
 *     Metatable: getmetatable(dummyTable)
 * }, true);
 * print(retrieved === dummyTable); // true
 * @see https://docs.sunc.su/Environment/filtergc
 */
declare function filtergc(
  filterType: string,
  filterOptions?: any,
  returnOne?: boolean,
): Array<any> | any;

/**
 * `getreg` returns the **Luau registry table**. The registry is a special table which is used internally to store references like threads, functions, and data shared between C and Luau (userdata).
 * @returns The registry table.
 * @example
 * const loopThread = task.spawn(() => {
 *     while (true) {
 *         task.wait(1);
 *         print("I am still running...");
 *     }
 * });
 * task.wait(0.2); // Let the loop run for a bit
 * for (const value of Object.values(getreg())) {
 *     if (value !== loopThread) continue;
 *     print(`Found loop thread: ${loopThread}`); // Should print
 *     coroutine.close(loopThread); // Should close the thread
 *     break;
 * }
 * @see https://docs.sunc.su/Environment/getreg
 */
declare function getreg(): { [key: string]: any };

/**
 * `getrenv` returns the **Roblox global environment**, which is used by the entire game. Changes to this environment will affect your executor environment as well.
 * @returns The Roblox global environment table.
 * @example
 * getrenv().warn = "Hello!";
 * print(typeof warn); // Output: string
 * getrenv().game = null;
 * print(game); // Output: null
 * @see https://docs.sunc.su/Environment/getrenv
 */
declare function getrenv(): { [key: string]: any };

/**
 * `getgenv` returns the **executor's global environment table**, which is shared across all executor-made threads.
 * @returns The executor's global environment table.
 * @example
 * getgenv().dummy_val = "value";
 * getfenv().dummy_val_2 = 1;
 * print(dummy_val, getgenv().dummy_val_2); // Output: value, 1
 * getgenv().dummy_val = "value2";
 * (globalThis as any).dummy_val = undefined;
 * print(dummy_val); // Output: value2
 * @see https://docs.sunc.su/Environment/getgenv
 */
declare function getgenv(): { [key: string]: any };
