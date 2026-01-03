/**
 * The **Scripts** library provides advanced functions for inspecting and interacting with script objects. It allows you to analyse bytecode, retrieve closures and environments, and simulate the loading or running of scripts.
 * @see https://docs.sunc.su/Scripts
 */

/**
 * `getloadedmodules` returns a list of all [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript) instances that have been **loaded** (e.g. [`require`'d](https://create.roblox.com/docs/reference/engine/globals/LuaGlobals#require)).
 * @returns An array of loaded ModuleScript instances.
 * @example
 * const loaded = new Instance("ModuleScript");
 * const notLoaded = new Instance("ModuleScript");
 * pcall(require, loaded);
 * for (const module of getloadedmodules()) {
 *     if (module === loaded) {
 *         // The first modulescript was found because it was required in line 4
 *         print("Found loaded module!");
 *     } else if (module === notLoaded) {
 *         // The second modulescript should NOT be found because it was never required
 *         print("This should never appear.");
 *     }
 * }
 * @see https://docs.sunc.su/Scripts/getloadedmodules
 */
declare function getloadedmodules(): Array<ModuleScript>;

/**
 * `getscripts` returns a list of **all [`Script`](https://create.roblox.com/docs/reference/engine/classes/Script), [`LocalScript`](https://create.roblox.com/docs/reference/engine/classes/LocalScript), and [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript) instances** present.
 * @returns An array of BaseScript and ModuleScript instances.
 * @example
 * const dummyScript = new Instance("LocalScript");
 * dummyScript.Name = "TestScript";
 * for (const script of getscripts()) {
 *     if (script === dummyScript) {
 *         print("Found the dummy script!");
 *     }
 * }
 * @see https://docs.sunc.su/Scripts/getscripts
 */
declare function getscripts(): Array<BaseScript | ModuleScript>;

/**
 * `getscripthash` returns a [SHA-384 hash](https://en.wikipedia.org/wiki/SHA-3) in ***hexadecimal format*** of the raw bytecode for a given [`Script`](https://create.roblox.com/docs/reference/engine/classes/Script), [`LocalScript`](https://create.roblox.com/docs/reference/engine/classes/LocalScript), or [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript).
 * @param script The [BaseScript](https://create.roblox.com/docs/reference/engine/classes/BaseScript) or [ModuleScript](https://create.roblox.com/docs/reference/engine/classes/ModuleScript) instance to hash.
 * @returns The SHA-384 hash as a hexadecimal string, or `nil` if the script cannot be hashed.
 * @example
 * const animate = game.Players.LocalPlayer.Character.FindFirstChild("Animate");
 * print(getscripthash(animate)); // Output: 384-bit hash string
 * print(getscripthash(new Instance("LocalScript"))); // Output: null
 * @see https://docs.sunc.su/Scripts/getscripthash
 */
declare function getscripthash(
  script: BaseScript | ModuleScript,
): string | undefined;

/**
 * `getsenv` returns the **global environment table** of a given [`Script`](https://create.roblox.com/docs/reference/engine/classes/Script), [`LocalScript`](https://create.roblox.com/docs/reference/engine/classes/LocalScript), or [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript).
 * @param script The script instance whose environment should be retrieved.
 * @returns The environment table of the script, or `nil` if not available.
 * @example
 * const animate = game.Players.LocalPlayer.Character.FindFirstChild("Animate");
 * const env = getsenv(animate);
 * print(typeof env.onSwimming); // Output: function
 * @see https://docs.sunc.su/Scripts/getsenv
 */
declare function getsenv(
  script: BaseScript | ModuleScript,
): { [key: string]: any } | undefined;

/**
 * `getrunningscripts` returns a list of **all running scripts** in the caller's global state. This includes [`Script`](https://create.roblox.com/docs/reference/engine/classes/Script), [`LocalScript`](https://create.roblox.com/docs/reference/engine/classes/LocalScript), and [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript) instances - excluding [`CoreScripts`](https://robloxapi.github.io/ref/class/CoreScript.html) by default.
 * @returns An array of running BaseScript and ModuleScript instances.
 * @example
 * const running = game.Players.LocalPlayer.Character.FindFirstChild("Animate");
 * const inactive = new Instance("LocalScript"); // Not running because no bytecode to run
 * for (const script of getrunningscripts()) {
 *     if (script === running) {
 *         print("Found the running Animate script.");
 *     } else if (script === inactive) {
 *         print("This should never print.");
 *         print("If this did print, then you have just experienced 1 in a quintillion chance of BITS FLIPPING from radiation. Do you live inside a nuclear reactor?");
 *     }
 * }
 * @see https://docs.sunc.su/Scripts/getrunningscripts
 */
declare function getrunningscripts(): Array<BaseScript | ModuleScript>;

/**
 * `getscriptclosure` creates and returns a Luau **function closure** from the compiled bytecode of a [`Script`](https://create.roblox.com/docs/reference/engine/classes/Script), [`LocalScript`](https://create.roblox.com/docs/reference/engine/classes/LocalScript), or [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript).
 * @param script The script instance to convert into a function.
 * @returns A function closure representing the script's bytecode, or `nil` if conversion fails.
 * @example
 * const animate = game.Players.LocalPlayer.Character.FindFirstChild("Animate");
 * const closure = getscriptclosure(animate);
 * print(typeof closure); // Output: function 0x....
 * print(getscriptclosure(new Instance("LocalScript"))); // Output: null
 * @see https://docs.sunc.su/Scripts/getscriptclosure
 */
declare function getscriptclosure(
  script: BaseScript | ModuleScript,
): ((...args: Array<any>) => any) | undefined;

/**
 * `getcallingscript` returns the [`Script`](https://create.roblox.com/docs/reference/engine/classes/Script), [`LocalScript`](https://create.roblox.com/docs/reference/engine/classes/LocalScript), or [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript) that **triggered the current code execution**.
 * @returns The script that called the current function, or `nil` if not called from a script.
 * @example
 * let old: (...args: Array<unknown>) => unknown;
 * old = hookmetamethod(game, "__index", (...args: Array<unknown>) => {
 *     if (!checkcaller()) {
 *         const caller = getcallingscript();
 *         warn("__index access from script:", caller && caller.GetFullName() || "Unknown");
 *         hookmetamethod(game, "__index", old); // Restore the original
 *         return old(...args);
 *     }
 *     return old(...args);
 * });
 * print(getcallingscript()); // Output: null, since we called from an executor thread
 * @see https://docs.sunc.su/Scripts/getcallingscript
 */
declare function getcallingscript(): BaseScript | ModuleScript | undefined;

/**
 * `getscriptbytecode` retrieves the bytecode of a [`LocalScript`](https://create.roblox.com/docs/reference/engine/classes/LocalScript), [`ModuleScript`](https://create.roblox.com/docs/reference/engine/classes/ModuleScript), and [`Script`](https://create.roblox.com/docs/reference/engine/classes/Script).
 * @param script The script instance to retrieve the bytecode from.
 * @returns The bytecode as a string, or `nil` if not available.
 * @example
 * const animate = game.Players.LocalPlayer.Character.FindFirstChild("Animate");
 * print(getscriptbytecode(animate)); // Returns bytecode as a string
 * print(getscriptbytecode(new Instance("LocalScript"))); // Output: null
 * @see https://docs.sunc.su/Scripts/getscriptbytecode
 */
declare function getscriptbytecode(
  script: BaseScript | ModuleScript,
): string | undefined;

/**
 * `loadstring` compiles a string of Luau code and returns it as a runnable function. If the code has errors, `nil` is returned and an error message is output.
 * @param source The source code string to compile.
 * @param chunkname? Custom chunk name for debugging.
 * @returns A tuple where the first element is the compiled function (or `nil` on error) and the second element is an error message (if any).
 * @example
 * loadstring(`
 *     (globalThis as any).placeholder = ["Example"];
 * `)();
 * print((globalThis as any).placeholder[0]); // Output: Example
 * @example
 * const [func, err] = loadstring("Example = ", "CustomChunk");
 * print(func); // Output: null
 * print(err);  // Output: [string "CustomChunk"]:1: Expected identifier when parsing expression, got <eof>
 * @see https://docs.sunc.su/Scripts/loadstring
 */
declare function loadstring<A extends Array<any> = Array<any>>(
  source: string,
  chunkname?: string,
): LuaTuple<[((...args: A) => any) | undefined, string | undefined]>;
