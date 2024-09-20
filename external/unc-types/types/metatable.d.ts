// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/metatable

type LuaMetatableFull<T> = LuaMetatable<T> & {
	__type?: string;
	__namecall?: (self: T, ...args: Array<unknown>) => void;
};

/**
 * Returns the metatable of `object` without triggering the `__metatable`
 * metamethod.
 * @param object The object to get the metatable of.
 * @returns The metatable of `object`.
 * @example
 * const metatable = getrawmetatable(game);
 * const index = metatable.__index;
 */
declare function getrawmetatable<T>(object: T): LuaMetatableFull<T>;

/**
 * Hooks `stub` to the given object's metamethod. Returns the original
 * function, which does not trigger the hook.
 * @param object The object to hook to.
 * @param metamethod The metamethod to hook to.
 * @param stub The function to redirect calls to.
 * @returns The original function.
 * @example
 * const internal: LuaMetatableFull<typeof game> = {};
 *
 * internal.__namecall = hookmetamethod(game, "__namecall", (self, ...args) => {
 * 	print(self, ...args);
 * 	return internal.__namecall!(self, ...args);
 * });
 */
declare function hookmetamethod<T, K extends keyof LuaMetatableFull<T>>(
	object: T,
	metamethod: K,
	stub: Required<LuaMetatableFull<T>>[K],
): Required<LuaMetatableFull<T>>[K];

/**
 * Returns whether `object` is frozen or read-only. Same as `table.isfrozen`.
 * @param object The object to check.
 * @returns Whether `object` is frozen.
 */
declare function isreadonly(object: unknown): boolean;

/**
 * Sets the metatable of `object` to `metatable` without triggering the
 * `__metatable` metamethod.
 * @param object The object to set the metatable of.
 * @param metatable The metatable to set.
 * @example
 * const metatable = getrawmetatable(game);
 * setrawmetatable(game, {
 * 	__type: metatable.__type,
 * 	__namecall: metatable.__namecall,
 * 	__tostring: metatable.__tostring,
 * 	__metatable: metatable.__metatable,
 * 	__index: metatable.__index,
 * 	__newindex: metatable.__newindex,
 * });
 */
declare function setrawmetatable<T>(object: T, metatable: LuaMetatableFull<T>): void;

/**
 * Sets whether `object` is frozen or read-only.
 * @param object The object to modify.
 * @param readonly Whether `object` can be written to.
 * @example
 * const metatable = getrawmetatable(game);
 * const index = metatable.__index!;
 * setreadonly(metatable, false);
 * metatable.__index = (...args) => index(...args);
 */
declare function setreadonly(object: unknown, readonly: boolean): void;
