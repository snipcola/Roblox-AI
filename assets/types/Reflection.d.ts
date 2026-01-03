/**
 * The **Reflection** library allows access to and manipulation of hidden or non-scriptable properties of [Instances](https://create.roblox.com/docs/reference/engine/classes/Instance) and internal execution context. It is primarily used to bypass standard Luau restrictions in controlled environments.
 * @see https://docs.sunc.su/Reflection
 */

/**
 * `gethiddenproperty` retrieves the value of a hidden or non-scriptable property (e.g. `BinaryString`, `SharedString`, `SystemAddress`) from a given [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance), even if it would normally throw an error when accessed directly.
 * @param instance The [instance](https://create.roblox.com/docs/reference/engine/classes/Instance) containing the hidden property.
 * @param property_name The name of the property to access.
 * @returns A tuple where the first element is the property value (or `nil` if not found) and the second is a boolean indicating success.
 * @example
 * const part = new Instance("Part");
 * print(gethiddenproperty(part, "Name"));       // Output: Part, false
 * print(gethiddenproperty(part, "DataCost"));   // Output: 20, false
 * print(gethiddenproperty(part, "NetworkOwnerV3"));   // Output: -1, true
 * @see https://docs.sunc.su/Reflection/gethiddenproperty
 */
declare function gethiddenproperty(
  instance: Instance,
  property_name: string,
): LuaTuple<[any, boolean]>;

/**
 * `isscriptable` returns whether the given property of an [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) is scriptable (i.e. it does not have the `notscriptable` tag).
 * @param object The [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) that owns the target property.
 * @param property The name of the property to check.
 * @returns `true` if the property is scriptable, `false` if not, or `nil` if the property does not exist.
 * @example
 * const part = new Instance("Part");
 * setscriptable(part, "BottomParamA", false);
 * print(isscriptable(part, "BottomParamA")); // false
 * @see https://docs.sunc.su/Reflection/isscriptable
 */
declare function isscriptable(
  object: Instance,
  property: string,
): boolean | undefined;

/**
 * `sethiddenproperty` assigns a value to a hidden or non-scriptable property of an [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance), even if that property is normally read-only or inaccessible.
 * @param instance The [instance](https://create.roblox.com/docs/reference/engine/classes/Instance) that owns the target property.
 * @param property_name The name of the property to update.
 * @param property_value The new value to assign to the property.
 * @returns `true` if the property was set successfully, otherwise `false`.
 * @example
 * const part = new Instance("Part");
 * print(gethiddenproperty(part, "DataCost")); // Output: 20, true
 * sethiddenproperty(part, "DataCost", 100);
 * print(gethiddenproperty(part, "DataCost")); // Output: 100, true
 * @see https://docs.sunc.su/Reflection/sethiddenproperty
 */
declare function sethiddenproperty(
  instance: Instance,
  property_name: string,
  property_value: any,
): boolean;

/**
 * `getthreadidentity` retrieves the thread's identity of the running [Luau thread](https://create.roblox.com/docs/reference/engine/libraries/coroutine#running).
 * @returns The current thread identity as a number.
 * @example
 * task.defer(() => {
 *     setthreadidentity(2);
 *     print(getthreadidentity()); // Output: 2
 * });
 * setthreadidentity(3);
 * print(getthreadidentity());     // Output: 3
 * @see https://docs.sunc.su/Reflection/getthreadidentity
 */
declare function getthreadidentity(): number;

/**
 * `setthreadidentity` sets the current [Luau thread](https://create.roblox.com/docs/reference/engine/libraries/coroutine#running) identity and capabilities matching that identity.
 * @param id The identity level to set the current thread to.
 * @example
 * setthreadidentity(2);
 * print(pcall(() => game.CoreGui)); // Output: false (restricted access)
 * setthreadidentity(8);
 * print(pcall(() => game.CoreGui)); // Output: true Instance
 * @see https://docs.sunc.su/Reflection/setthreadidentity
 */
declare function setthreadidentity(id: number): void;

/**
 * `setscriptable` toggles the scriptability of a hidden or non-scriptable property on an [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance). When a property is made scriptable, it can be accessed or assigned through standard indexing.
 * @param instance The [Instance](https://create.roblox.com/docs/reference/engine/classes/Instance) that owns the target property.
 * @param property_name The name of the property to make scriptable or un-scriptable.
 * @param state Whether to enable (`true`) or disable (`false`) scriptability.
 * @returns `true` if the operation was successful, otherwise `false` or `nil` if the property does not exist.
 * @example
 * const part = new Instance("Part");
 * setscriptable(part, "BottomParamA", true);
 * print(part.BottomParamA); // Output: -0.5
 * setscriptable(part, "BottomParamA", false);
 * print(part.BottomParamA); // Throws an error
 * @see https://docs.sunc.su/Reflection/setscriptable
 */
declare function setscriptable(
  instance: Instance,
  property_name: string,
  state: boolean,
): boolean | undefined;
