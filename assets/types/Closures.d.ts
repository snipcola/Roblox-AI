/**
 * The **Closures** library enables the inspection, modification and creation of Luau closures with precise control.
 * It is one of the most powerful tools available, exposing internals in a way that Luau does not natively support out of the box.
 * This library is incredibly useful for hooking functions to modify game logic to your own advantage, and any other creative uses you can think of.
 * @see https://docs.sunc.su/Closures
 */

/**
 * `isexecutorclosure` checks whether a given function is a closure of the executor. This also includes closures retrieved using [`getscriptclosure`](https://docs.sunc.su/Scripts/getloadedmodules) or [`loadstring`](https://docs.sunc.su/Scripts/loadstring)
 * @param func The function to check.
 * @returns `true` if the function is an executor closure, otherwise `false`.
 * @example
 * const dummyLuaFunction = () => {
 *     print("This is an executor Luau closure");
 * };
 * const dummyCFunction = newcclosure(() => {
 *     print("This is an executor C closure");
 * });
 * const dummyStandardCFunction = print;
 * const dummyGlobalCFunction = getgc;
 * print(isexecutorclosure(dummyLuaFunction)); // Output: true
 * print(isexecutorclosure(dummyCFunction)); // Output: true
 * print(isexecutorclosure(dummyGlobalCFunction)); // Output: true
 * print(isexecutorclosure(dummyStandardCFunction)); // Output: false
 * @see https://docs.sunc.su/Closures/isexecutorclosure
 */
declare function isexecutorclosure(func: (...args: Array<any>) => any): boolean;

/**
 * `islclosure` checks whether a given function is a Luau closure or not.
 * @param func The function to check.
 * @returns `true` if the function is a Luau closure, otherwise `false`.
 * @example
 * const dummyLuaFunction = () => {
 *     print("This is an executor Luau closure");
 * };
 * const dummyCFunction = newcclosure(() => {
 *     print("This is an executor C closure");
 * });
 * const dummyStandardCFunction = print;
 * print(islclosure(dummyLuaFunction)); // Output: true
 * print(islclosure(dummyStandardCFunction)); // Output: false
 * print(islclosure(dummyCFunction)); // Output: false
 * @see https://docs.sunc.su/Closures/islclosure
 */
declare function islclosure(func: (...args: Array<any>) => any): boolean;

/**
 * `clonefunction` creates and returns a new function that has the exact same behaviour as the passed function.
 * @param functionToClone The function to clone.
 * @returns A new function with the same behavior as `functionToClone`.
 * @example
 * const dummyFunction = () => {
 *     print("Hello");
 * };
 * const clonedFunction = clonefunction(dummyFunction);
 * print(dummyFunction === clonedFunction); // Output: false
 * @see https://docs.sunc.su/Closures/clonefunction
 */
declare function clonefunction<A extends Array<any>, R>(
  functionToClone: (...args: A) => R,
): (...args: A) => R;

/**
 * `newcclosure` takes any Luau function and wraps it into a C closure.
 * @param functionToWrap A function to be wrapped.
 * @returns The wrapped function as a C closure.
 * @example
 * const dummyFunction = (...args: Array<unknown>) => {
 *     return args[0];
 * };
 * print(iscclosure(dummyFunction)); // Output: false
 * const wrappedFunction = newcclosure(dummyFunction);
 * print(iscclosure(wrappedFunction)); // Output: true
 * const functionResults = wrappedFunction("Hello");
 * print(functionResults); // Output: Hello
 *
 * const dummyYieldingFunction = newcclosure(() => {
 *     print("Before");
 *     task.wait(1.5);
 *     print("After");
 * });
 * dummyYieldingFunction();
 * // Output:
 * // Before
 * // yield for 1.5 seconds
 * // After
 * @see https://docs.sunc.su/Closures/newcclosure
 */
declare function newcclosure<A extends Array<any>, R>(
  functionToWrap: (...args: A) => R,
): (...args: A) => R;

/**
 * `hookmetamethod` takes any Luau object that can have a metatable, and attempts to hook the specified metamethod of the object. Internally, it essentially uses [`hookfunction`](https://docs.sunc.su/Closures/hookfunction) to hook specific metamethods.
 * @param object The object which has a metatable.
 * @param metamethodName The name of the metamethod to hook.
 * @param hook The function that will be used as a hook.
 * @returns The original metamethod function.
 * @example
 * let original: (...args: Array<unknown>) => unknown;
 * original = hookmetamethod(game, "__index", (...args: Array<unknown>) => {
 *     const key = args[1];
 *     print(key);
 *     return original(...args);
 * });
 * const _ = game.PlaceId; // Output: "PlaceId"
 * hookmetamethod(game, "__index", original); // Restores game's __index
 * @see https://docs.sunc.su/Closures/hookmetamethod
 */
declare function hookmetamethod<T extends object>(
  object: T,
  metamethodName: string,
  hook: (...args: Array<any>) => any,
): (...args: Array<any>) => any;

/**
 * `getfunctionhash` returns the ***hex-represented*** [SHA384 hash](https://en.wikipedia.org/wiki/SHA-2) of a provided function's instructions (code) and constants.
 * @param functionToHash The function to retrieve the hash of.
 * @returns The SHA384 hash of the function as a hexadecimal string.
 * @example
 * const isSha384Hex = (hash: string): boolean => {
 *     return hash.length === 96 && hash.match("^[0-9a-fA-F]+$") !== null;
 * };
 * const dummyFunction0 = () => {};
 * const dummyFunction1 = (...args: Array<unknown>) => {};
 * const dummyFunction2 = () => {};
 * const dummyFunction3 = () => "Constant";
 * const dummyFunction4 = () => "Constant2";
 * print(isSha384Hex(getfunctionhash(dummyFunction0))); // Output: true
 * print(getfunctionhash(dummyFunction0) === getfunctionhash(dummyFunction1)); // Output: false
 * print(getfunctionhash(dummyFunction0) === getfunctionhash(dummyFunction2)); // Output: true
 * print(getfunctionhash(dummyFunction3) === getfunctionhash(dummyFunction4)); // Output: false
 * @see https://docs.sunc.su/Closures/getfunctionhash
 */
declare function getfunctionhash(
  functionToHash: (...args: Array<any>) => any,
): string;

/**
 * `iscclosure` checks whether a given function is a C closure or not.
 * @param func The function to check.
 * @returns `true` if the function is a C closure, otherwise `false`.
 * @example
 * const dummyLuaFunction = () => {
 *     print("This is an executor Luau closure");
 * };
 * const dummyCFunction = newcclosure(() => {
 *     print("This is an Executor C Closure");
 * });
 * const dummyStandardFunction = print;
 * const dummyGlobalCFunction = getgc;
 * print(iscclosure(dummyCFunction)); // Output: true
 * print(iscclosure(dummyGlobalCFunction)); // Output: true
 * print(iscclosure(dummyStandardFunction)); // Output: true
 * print(iscclosure(dummyLuaFunction)); // Output: false
 * @see https://docs.sunc.su/Closures/iscclosure
 */
declare function iscclosure(func: (...args: Array<any>) => any): boolean;

/**
 * `restorefunction` restores a hooked function back to the very first original function, even if it has been hooked multiple times.
 * @param functionToRestore The hooked function that you want to restore.
 * @example
 * const dummyFunc = () => {
 *     print("I am not hooked!");
 * };
 *
 * hookfunction(dummyFunc, () => {
 *     print("I am hooked!");
 * });
 *
 * dummyFunc(); // Output: I am hooked!
 * restorefunction(dummyFunc);
 * dummyFunc(); // Output: I am not hooked!
 *
 * // Trying to restore a function that was not hooked will throw an error.
 * const anotherFunc = () => {
 *     print("I am not hooked!");
 * };
 * anotherFunc(); // Output: I am not hooked!
 * // restorefunction(anotherFunc); // This would throw an error: restorefunction: function is not hooked
 * @see https://docs.sunc.su/Closures/restorefunction
 */
declare function restorefunction(
  functionToRestore: (...args: Array<any>) => any,
): void;

/**
 * `checkcaller` returns a boolean indicating whether the **current function was invoked from the executor's own thread**. This is useful for differentiating between your own calls and those made by the game.
 * @returns `true` if the current function was invoked from the executor's own thread, otherwise `false`.
 * @example
 * let fromCaller: boolean | undefined;
 * const original = hookmetamethod(game, "__namecall", (...args: Array<unknown>) => {
 *     if (fromCaller === undefined) {
 *         fromCaller = checkcaller();
 *     }
 *     return original(...args);
 * });
 * task.wait(0.1); // Step a bit
 * hookmetamethod(game, "__namecall", original);
 * print(fromCaller);       // Output: false
 * print(checkcaller());    // Output: true (current thread)
 * @see https://docs.sunc.su/Closures/checkcaller
 */
declare function checkcaller(): boolean;

/**
 * `hookfunction` allows you to hook a function with another wanted function, returning the original unhooked function.
 * @param functionToHook The function that will be hooked.
 * @param hook The function that will be used as a hook.
 * @returns The original function before being hooked.
 * @example
 * const dummyFunc = () => {
 *     print("I am not hooked!");
 * };
 * const dummyHook = () => {
 *     print("I am hooked!");
 * };
 * dummyFunc(); // Output: I am not hooked!
 * const oldFunc = hookfunction(dummyFunc, dummyHook);
 * dummyFunc(); // Output: I am hooked!
 * oldFunc(); // Output: I am not hooked!
 * @see https://docs.sunc.su/Closures/hookfunction
 */
declare function hookfunction<
  A1 extends Array<any>,
  R1,
  A2 extends Array<any>,
  R2,
>(
  functionToHook: (...args: A1) => R1,
  hook: (...args: A2) => R2,
): (...args: A1) => R1;
