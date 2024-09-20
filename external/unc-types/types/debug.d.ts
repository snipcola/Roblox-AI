// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/debug

interface ChunkInfo {
	source: string;
	what: string;
	numparams: number;
	func: Callback;
	short_src: string;
	currentline: number;
	nups: number;
	is_vararg: number;
	name: string;
}

declare namespace debug {
	/**
	 * Returns the constant at index `index` in the function or level `fn`.
	 * @param fn The function or level to look up.
	 * @param index The index of the constant to look up.
	 * @returns The constant at index `index` in the function or level `fn`.
	 * @example
	 * function foo() {
	 * 	print("Hello, world!");
	 * }
	 * debug.getconstant(foo, 1); // print
	 * debug.getconstant(foo, 2); // "Hello, world!"
	 */
	function getconstant(fn: Callback | number, index: number): unknown;

	/**
	 * Returns a list of constants in the function or level `fn`.
	 * @param fn The function or level to look up.
	 * @returns A list of constants in the function or level `fn`.
	 * @example
	 * function foo() {
	 * 	const B = 123456;
	 * 	print(B, "Hello", warn);
	 * }
	 * debug.getconstants(foo).forEach(print); // "print", 123456, "Hello", "warn"
	 */
	function getconstants(fn: Callback | number): readonly (string | number)[];

	/**
	 * Returns information about the function or level `fn`.
	 */
	function getinfo(fn: Callback | number): ChunkInfo;

	/**
	 * Returns the proto at `index` in the function or level `fn`. If `active` is
	 * true, it will return a table of every active closure for the proto.
	 * @param fn The function or level to look up.
	 * @param index The index of the proto to look up.
	 * @returns The proto at `index` of `fn`.
	 * @example
	 * function foo() {
	 * 	const bar = () => "baz";
	 * 	print(bar, bar());
	 * }
	 *
	 * foo();
	 *
	 * const [bar] = debug.getproto(foo, 1, true); // () => "baz"
	 * print(bar()); // baz
	 */
	function getproto(fn: Callback | number, index: number): Callback;
	/**
	 * Returns the proto at `index` in the function or level `fn`. If `active` is
	 * true, it will return a table of every active closure for the proto.
	 * @param fn The function or level to look up.
	 * @param index The index of the proto to look up.
	 * @param active Whether to return a table of active closures for the proto.
	 * @returns The proto at `index` of `fn`, or a list of protos.
	 * @example
	 * function foo() {
	 * 	const bar = () => "baz";
	 * 	print(bar, bar());
	 * }
	 *
	 * foo();
	 *
	 * const [bar] = debug.getproto(foo, 1, true); // () => "baz"
	 * print(bar()); // baz
	 */
	function getproto<T extends boolean>(
		fn: Callback | number,
		index: number,
		active: T,
	): T extends true ? readonly Callback[] : Callback;

	/**
	 * Returns a list of protos in the function or level `fn`.
	 * @param fn The function or level to look up.
	 * @returns A list of functions.
	 */
	function getprotos(fn: Callback | number): readonly Callback[];

	/**
	 * Returns the value at `index` in the stack frame `level`.
	 * @param level The stack frame to look up.
	 * @param index The index of the value to look up.
	 * @returns The value in the stack.
	 *
	 * @example
	 * print(1, 5, debug.getstack(1, 3)); // 1 5 5
	 * print(1, 5, debug.getstack(1, 2)); // 1 5 1
	 */
	function getstack(level: number, index: number): unknown;

	/**
	 * Returns the upvalue at `index` in the function or level `fn`.
	 * @param fn The function or level to look up.
	 * @param index The index of the upvalue to look up.
	 * @returns The upvalue in the function or level.
	 * @example
	 * const upvalue = "Hello, world!";
	 * const foo = () => print(upvalue);
	 * debug.getupvalue(foo, 1); // "Hello, world!"
	 */
	function getupvalue(fn: Callback | number, index: number): unknown;

	/**
	 * Returns a list of upvalues in the function or level `fn`.
	 *
	 * **WARNING:** Upvalues can be undefined, so normal array iteration is risky.
	 * Instead, iterate through `Object.entries` from `@rbxts/object-utils`.
	 *
	 * @param fn The function or level to look up.
	 * @returns A list of values.
	 *
	 * @example
	 * const up0 = "Hello, ";
	 * const up1 = "world!";
	 * const foo = () => print(up0, up1);
	 * debug.getupvalues(foo); // ["Hello, ", "world!"]
	 */
	function getupvalues(fn: Callback | number): readonly unknown[];

	/**
	 * Sets the constant at `index` in the function or level `fn` to `value`.
	 *
	 * **NOTE:** The type of `value` must match the type of the constant at `index`.
	 *
	 * @param fn The function or level to look up.
	 * @param index The index of the constant to look up.
	 * @param value The value to set.
	 *
	 * @example
	 * const foo = () => print("Hello, world!");
	 * debug.setconstant(foo, 2, "Goodbye, world!");
	 * debug.getconstant(foo, 2); // "Goodbye, world!"
	 */
	function setconstant(fn: Callback | number, index: number, value: unknown): void;

	/**
	 * Sets the register at `index` in the stack frame `level` to `value`.
	 *
	 * **NOTE:** The type of `value` must match the type of the register at `index`.
	 *
	 * @param level The stack frame to look up.
	 * @param index The index of the register to look up.
	 * @param value The value to set.
	 *
	 * @example
	 * print(1, 2); // 1, 2
	 * print(1, 2, debug.setstack(1, 2, 500)); // 1, 500
	 * print(1, 2, debug.setstack(1, 2, 2000)); // 1, 2000
	 */
	function setstack(level: number, index: number, value: unknown): void;

	/**
	 * Sets the upvalue at `index` in the function or level `fn` to `value`.
	 * @param fn The function or level to look up.
	 * @param index The index of the upvalue to look up.
	 * @param value The value to set.
	 * @example
	 * const upvalue = "Hello, world!";
	 * const foo = () => print(upvalue);
	 * foo(); // Hello, world!
	 * debug.setupvalue(foo, 1, "Goodbye, world!");
	 * foo(); // Goodbye, world!
	 */
	function setupvalue(fn: Callback | number, index: number, value: unknown): void;
}
