// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/cache

/**
 * Handles references to Roblox instances in the cache.
 */
declare namespace cache {
	/**
	 * Invalidates `object` in the instance cache.
	 * @param object The Roblox instance to invalidate.
	 * @example
	 * const Workspace = game.GetService("Workspace");
	 * cache.invalidate(game.GetService("Workspace"));
	 * print(Workspace, Workspace === game.GetService("Workspace")); // Workspace, false
	 */
	function invalidate(object: Instance): void;

	/**
	 * Checks whether `object` exists in the instance cache.
	 * @param object The Roblox instance to check.
	 * @returns Whether `object` exists in the instance cache.
	 */
	function iscached(object: Instance): boolean;

	/**
	 * Replaces `object` with `replacement` in the instance cache.
	 * @param object The Roblox instance to replace.
	 * @param replacement The replacement instance.
	 * @example
	 * // The cached instance for Workspace is now Players.
	 * // Every time Workspace is accessed from the cache, it will receive Players.
	 * cache.replace(game.GetService("Workspace"), game.GetService("Players"));
	 * print(game.GetService("Workspace")); // Players
	 */
	function replace(object: Instance, replacement: Instance): void;
}

/**
 * Returns a copy of `object`'s instance reference. This can be used to access
 * an instance without referencing it.
 * @param object The Roblox instance to clone.
 * @returns A copy of the instance reference for `object`.
 * @example
 * const copy = cloneref(game.GetService("Workspace"));
 * print(clone === game.GetService("Workspace")); // false
 */
declare function cloneref(object: Instance): Instance;

/**
 * Compares the first instance with the second instance, regardless of whether
 * the reference is a copy.
 * @param a The first instance to compare.
 * @param b The second instance to compare.
 * @returns Whether `a` and `b` reference the same instance.
 * @example
 * const copy = cloneref(game.GetService("Workspace"));
 * print(copy === game.GetService("Workspace")); // false
 * print(compareinstances(copy, game.GetService("Workspace"))); // true
 */
declare function compareinstances(a: Instance, b: Instance): boolean;
