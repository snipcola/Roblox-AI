// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/closure

/**
 * Returns whether the current function was called by the executor.
 */
declare function checkcaller(): boolean;

/**
 * Creates a copy of the given function.
 * @param fn The function to copy.
 * @returns A copy of `fn`.
 * @example
 * const copy = clonefunction(print);
 * copy("Hello, world!"); // Hello, world!!
 * print("Hello, world!"); // Hello, world!!
 * print(copy === print); // false
 */
declare function clonefunction<T extends Callback>(fn: T): T;
/**
 * @alias clonefunction
 * @hidden
 */
declare const clonefunc: typeof clonefunction | undefined;

/**
 * Returns the script that is running the current function.
 */
declare function getcallingscript(): LocalScript | ModuleScript;

/**
 * Generates a new closure based on the script's bytecode.
 * @param object The script to generate a closure for.
 * @returns A closure generated from the script's bytecode.
 */
declare function getscriptclosure(object: LocalScript | ModuleScript): Callback;
/**
 * @alias getscriptclosure
 * @hidden
 */
declare const getscriptfunction: typeof getscriptclosure | undefined;

/**
 * Hooks `stub` to `fn`, where calls to `fn` will be redirected to `stub`.
 * Returns the original function, which does not trigger the hook.
 *
 * **WARNING:** Type safety is not guaranteed when calling the hooked function.
 *
 * @param fn The function to hook to.
 * @param stub The function to redirect calls to.
 * @returns The original function.
 *
 * @example
 * const backup = hookfunction(print, warn); // Hooks 'warn' to 'print'
 * print("Hello, world!"); // Warns "Hello, world!"
 * backup("Hello, world!"); // Prints "Hello, world!"
 */
declare function hookfunction<T extends Callback>(fn: T, stub: Callback): T;
/**
 * @alias hookfunction
 * @hidden
 */
declare const replaceclosure: typeof hookfunction | undefined;

/**
 * Returns whether `fn` is a C closure.
 * @param fn The function to verify.
 * @example
 * print(iscclosure(print)); // true
 * print(iscclosure(() => {})); // false
 */
declare function iscclosure(fn: Callback): boolean;

/**
 * Returns whether `fn` is a function created by the executor.
 * @param fn The function to verify.
 * @example
 * print(iscclosure(print)); // false
 * print(iscclosure(() => {})); // true
 */
declare function isexecutorclosure(fn: Callback): boolean;
/**
 * @alias isexecutorclosure
 * @hidden
 */
declare const checkclosure: typeof isexecutorclosure | undefined;
/**
 * @alias isexecutorclosure
 * @hidden
 */
declare const isourclosure: typeof isexecutorclosure | undefined;

/**
 * Returns whether `fn` is a Lua closure.
 * @param fn The function to verify.
 * @example
 * print(iscclosure(print)); // false
 * print(iscclosure(() => {})); // true
 */
declare function islclosure(fn: Callback): boolean;

/**
 * Gets a chunk using the Luau code in `source`. Returns the compiled function.
 *
 * If there are no errors, returns the compiled chunk as a function; otherwise,
 * returns `undefined` plus the error message. The environment of the returned
 * function is the global environment.
 *
 * `chunkname` is used as the chunk name for error messages and debug
 * information. When absent, it defaults to `source`.
 *
 * @param source The Luau code to compile.
 * @param chunkname Optional name of the chunk for debugging.
 * @returns The compiled chunk, and an error message if compilation failed.
 *
 * @example
 * const [fn, err] = loadstring("print('Hello, world!')");
 * assert(fn, err);
 * fn();
 *
 * @see https://www.lua.org/manual/5.1/manual.html#pdf-loadstring
 */
declare function loadstring<T extends Callback = Callback>(
  source: string,
  chunkname?: string,
): LuaTuple<[T, undefined] | [undefined, string]>;

/**
 * Returns `fn` wrapped in a C closure. The result is functionally identical
 * to `fn`, but is identified as a C closure.
 *
 * **WARNING:** This function may interfere with yielding.
 *
 * @param fn The function to wrap.
 * @returns The wrapped function.
 *
 * @example
 * const myFunction = () => {};
 * const myCClosure = newcclosure(myFunction);
 * print(iscclosure(myFunction)); // false
 * print(iscclosure(myCClosure)); // true
 */
declare function newcclosure<T extends Callback>(fn: T): T;
