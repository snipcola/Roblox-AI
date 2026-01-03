/**
 * The **Debug** library offers powerful tools for inspecting and modifying Luau functions at a bytecode level.
 * It allows you to access constants, upvalues, stack frames, and internal structures of functions that would otherwise be hidden - making it especially useful for reverse engineering and hooking.
 * @see https://docs.sunc.su/Debug
 */

declare namespace debug {
  /**
   * Returns all function prototypes defined within the specified Luau function.
   * @param func The Luau function (or stack level) to extract protos from.
   * @returns An array of function prototypes.
   * @example
   * const DummyFunction0 = () => {
   *     const DummyFunction1 = () => {};
   *     const DummyFunction2 = () => {};
   * };
   * const protos = debug.getprotos(DummyFunction0);
   * for (let i = 0; i < protos.length; i++) {
   *     print(i+1, protos[i]);
   * }
   * // Output (example):
   * // 1 function: 0x...
   * // 2 function: 0x...
   * @see https://docs.sunc.su/Debug/getprotos
   */
  function getprotos(
    func: ((...args: Array<any>) => any) | number,
  ): Array<(...args: Array<any>) => any>;

  /**
   * Replaces a value in a specified stack frame.
   * @param level The stack level to target. `1` refers to the current function.
   * @param index The index/slot in the stack frame to replace.
   * @param value The new value to assign at that stack slot.
   * @example
   * throw debug.setstack(1, 1, () => {
   *     return () => {
   *         print("Replaced");
   *     };
   * })(); // Output: Replaced
   * @example
   * let outerValue = 10;
   * const innerFunction = () => {
   *     outerValue += 9;
   *     debug.setstack(2, 1, 100);
   * };
   * innerFunction();
   * print(outerValue); // Output: 100
   * @see https://docs.sunc.su/Debug/setstack
   */
  function setstack(level: number, index: number, value: any): void;

  /**
   * Returns the constant at the specified index from a Luau function. If no constant exists at that index, it returns `nil` instead.
   * @param func The Luau function (or stack level) whose constant to retrieve.
   * @param index The position of the desired constant.
   * @returns The constant value, which can be a number, string, boolean, or nil.
   * @example
   * const dummyFunction = () => {
   *     const dummyString = "foo bar";
   *     string.split(dummyString, " ");
   * };
   * const result = debug.getconstant(dummyFunction, 2);
   * print(result); // Output: string
   * @example
   * const dummyFunction = () => {
   *     const dummyString = "foo bar";
   *     string.split(dummyString, " ");
   * };
   * const result = debug.getconstant(dummyFunction, 3);
   * print(result); // Output: undefined
   * @example
   * print(debug.getconstant(print, 1)); // Should error due to being a C closure
   * @see https://docs.sunc.su/Debug/getconstant
   */
  function getconstant(
    func: ((...args: Array<any>) => any) | number,
    index: number,
  ): number | string | boolean | undefined;

  /**
   * Returns a list of all constants used within a Luau function's bytecode. This includes literal values like numbers, strings, booleans, and `nil`.
   * @param func The Luau function (or stack level) whose constants will be returned.
   * @returns An array of constants (numbers, strings, booleans, or nil).
   * @example
   * const dummyFunction = () => {
   *     const dummyString = "foo bar";
   *     string.split(dummyString, " ");
   * };
   * const constants = debug.getconstants(dummyFunction);
   * for (let i = 0; i < constants.length; i++) {
   *     print(`[${i + 1}]: ${constants[i]}`);
   * }
   * // Output:
   * // [1]: "string"
   * // [2]: "split"
   * // [4]: "foo bar"
   * // [5]: " "
   * @example
   * print(debug.getconstants(print)); // Should error due to being a C closure
   * @see https://docs.sunc.su/Debug/getconstants
   */
  function getconstants(
    func: ((...args: Array<any>) => any) | number,
  ): Array<number | string | boolean | undefined>;

  /**
   * Retrieves values from the stack at the specified call level.
   * @param level The stack level to inspect. `1` is the current function.
   * @param index The specific slot/index at that stack level to read (optional).
   * @returns If index is provided, returns the value at that slot. Otherwise, returns the entire stack frame.
   * @example
   * let count = 0;
   * const recursiveFunction = () => {
   *     count += 1;
   *     if (count > 6) return;
   *     let a = 29;
   *     let b = true;
   *     let c = "Example";
   *     a += 1;
   *     b = false;
   *     c += "s";
   *     print(debug.getstack(1, count));
   *     recursiveFunction();
   * };
   * recursiveFunction();
   * // Output (varies depending on Count):
   * // 30
   * // false
   * // Examples
   * // function: 0x... (print)
   * // function: 0x... (getstack)
   * // etc.
   * @example
   * const dummyFunction = () => {
   *     return "Hello";
   * };
   * let var_ = 5;
   * var_ += 1;
   * (() => {
   *     print(debug.getstack(2)[1]()); // Output: Hello
   *     print(debug.getstack(2)[2]);   // Output: 6
   * })();
   * @see https://docs.sunc.su/Debug/getstack
   */
  function getstack(level: number, index?: number): any;

  /**
   * Returns a list of upvalues captured by a Luau function. These are the external variables that a function closes over from its surrounding scope.
   * @param func The Luau function (or stack level) to retrieve upvalues from.
   * @returns An array of upvalues.
   * @example
   * let var1 = false;
   * let var2 = "Hi";
   * const dummyFunction = () => {
   *     var1 = true;
   *     var2 += ", hello";
   * };
   * for (let index = 0; index < debug.getupvalues(dummyFunction).length; index++) {
   *     print(index + 1, debug.getupvalues(dummyFunction)[index]);
   * }
   * // Output:
   * // 1 false
   * // 2 Hi
   * @example
   * const dummyFunction = () => {
   *     return 123;
   * };
   * print(debug.getupvalues(dummyFunction).length > 0 ? 1 : null); // Output: null
   * @example
   * print(debug.getupvalues(print)); // Should error due to C closure
   * @see https://docs.sunc.su/Debug/getupvalues
   */
  function getupvalues(
    func: ((...args: Array<any>) => any) | number,
  ): Array<any>;

  /**
   * Replaces an upvalue at the specified index in a Luau function, with a new value.
   * @param func The function (or stack level) whose upvalue to replace.
   * @param index The index of the upvalue to be replaced.
   * @param value The new value to assign to the upvalue.
   * @example
   * let upvalue = 90;
   * const dummyFunction = () => {
   *     upvalue += 1;
   *     print(upvalue);
   * };
   * dummyFunction(); // Output: 91
   * debug.setupvalue(dummyFunction, 1, 99);
   * dummyFunction(); // Output: 100
   * @see https://docs.sunc.su/Debug/setupvalue
   */
  function setupvalue(
    func: ((...args: Array<any>) => any) | number,
    index: number,
    value: any,
  ): void;

  /**
   * Returns the upvalue at the specified index from a Luau function's closure. If the index is invalid or out of bounds, an error will occur.
   * @param func The Luau function (or stack level) to retrieve an upvalue from.
   * @param index The position of the upvalue.
   * @returns The upvalue.
   * @example
   * const upFunction = () => {
   *     print("Hello from up");
   * };
   * const dummyFunction = () => {
   *     upFunction();
   * };
   * const retrieved = debug.getupvalue(dummyFunction, 1);
   * retrieved(); // Output: Hello from up
   * @example
   * const dummyFunction = () => {};
   * debug.getupvalue(dummyFunction, 0); // Should error
   * @example
   * debug.getupvalue(print, 1); // Should error due to C closure
   * @see https://docs.sunc.su/Debug/getupvalue
   */
  function getupvalue(
    func: ((...args: Array<any>) => any) | number,
    index: number,
  ): any;

  /**
   * Returns a specific function prototype from a Luau function by index. Optionally, it can search for **active functions** of the proto, if the `activated` parameter is set to `true`.
   * @param func The Luau function (or stack level) to extract a proto from.
   * @param index The index of the prototype to return.
   * @param activated If `true`, returns a table of currently active functions based on the proto.
   * @returns If `activated` is true, returns an array of active functions; otherwise, returns a single function prototype.
   * @example
   * const dummyFunction = () => {
   *     const dummyProto1 = () => {
   *         print("Hello");
   *     };
   *     const dummyProto2 = () => {
   *         print("Hello2");
   *     };
   * };
   * debug.getproto(dummyFunction, 1)(); // Uncallable
   * debug.getproto(dummyFunction, 2)(); // Uncallable
   * @example
   * const dummyFunction = () => {
   *     const dummyProto = () => {
   *         return "hi";
   *     };
   *     return dummyProto;
   * };
   * const realProto = dummyFunction();
   * const retrievedProto = (debug.getproto(dummyFunction, 1, true) as Array<() => any>)[0];
   * print(realProto === retrievedProto); // Output: true
   * print(retrievedProto()); // Output: hi
   * @see https://docs.sunc.su/Debug/getproto
   */
  function getproto(
    func: ((...args: Array<any>) => any) | number,
    index: number,
    activated?: boolean,
  ): ((...args: Array<any>) => any) | Array<(...args: Array<any>) => any>;

  /**
   * Modifies a constant at the specified index in a Luau function bytecode.
   * @param func The Luau function (or stack level) whose constant to modify.
   * @param index The position of the constant to change.
   * @param value The new constant value to set.
   * @example
   * const dummyFunction = () => {
   *     print(game.Name);
   * };
   * debug.setconstant(dummyFunction, 4, "Players");
   * dummyFunction(); // Output: Players
   * @see https://docs.sunc.su/Debug/setconstant
   */
  function setconstant(
    func: ((...args: Array<any>) => any) | number,
    index: number,
    value: number | string | boolean | undefined,
  ): void;
}
