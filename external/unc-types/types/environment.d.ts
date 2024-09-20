// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/environment

/**
 * Extends the behavior of a normal RBXScriptConnection.
 */
interface MockConnection {
	/**
	 * Whether the connection can fire.
	 */
	readonly Enabled: boolean;

	/**
	 * True when connected to a foreign state (i.e. core scripts).
	 */
	readonly ForeignState: boolean;

	/**
	 * True if the connection was created in Luau/
	 */
	readonly LuaConnection: boolean;

	/**
	 * The function bound to this connection. Nil when `ForeignState` is true.
	 */
	readonly Function?: Callback;

	/**
	 * The thread bound to this connection. Nil when `ForeignState` is true.
	 */
	readonly Thread?: thread;

	/**
	 * Fires the signal with the given arguments.
	 */
	Fire(this: MockConnection, ...args: unknown[]): void;

	/**
	 * Defers the signal with the given arguments.
	 * For more info regarding defered events, see: https://devforum.roblox.com/t/beta-deferred-lua-event-handling/1240569
	 */
	Defer(this: MockConnection, ...args: unknown[]): void;

	/**
	 * Disconnects the connection.
	 */
	Disconnect(this: MockConnection): void;

	/**
	 * Prevents the connection from firing.
	 */
	Disable(this: MockConnection): void;

	/**
	 * Allows the connection to fire if it was previously disabled.
	 */
	Enable(this: MockConnection): void;
}

/**
 * Gets a list of connections for the given signal. Returns mock connections
 * that extend the behavior of the original RBXScriptConnections.
 * @param signal The signal to get connections for.
 * @returns A list of mock connections.
 * @example
 * for (const connection of getconnections(game.GetService("Workspace").ChildAdded)) {
 * 	connection.Disable();
 * }
 */
declare function getconnections(signal: RBXScriptSignal): readonly MockConnection[];

/**
 * Returns the garbage collection object.
 * @param includeTables Whether to include tables in the GC.
 */
declare function getgc<T extends boolean>(
	includeTables: T,
): T extends true ? readonly (Callback | Instance)[] : readonly (Callback | Instance | object)[];
/**
 * Returns the garbage collection object.
 * @param includeTables Whether to include tables in the GC.
 */
declare function getgc(): readonly (Callback | Instance | object)[];

/**
 * Returns the engine's custom global environment.
 * @returns A mutable table.
 */
declare function getgenv(): Record<string, unknown>;

/**
 * Finds the given hidden property of a Roblox instance.
 * @param instance The instance to find the property of.
 * @param property The property to find.
 * @returns The value of the property.
 */
declare function gethiddenproperty(object: Instance, property: string): unknown;
/**
 * @alias gethiddenproperty
 * @hidden
 */
declare const gethiddenprop: typeof gethiddenproperty | undefined;

/**
 * Returns a hidden UI container as an alternative to CoreGui. Automatically
 * protects UI from common detection methods.
 * @returns The hidden UI container.
 */
declare function gethui(): BasePlayerGui;

/**
 * Returns a list of every instance in the game that has a reference.
 * @returns A list of instances.
 */
declare function getinstances(): readonly Instance[];

/**
 * Returns a list of ModuleScripts that have been loaded in the game. If
 * `filterCoreScripts` is true, only returns ModuleScripts that are not core
 * scripts.
 * @param filterCoreScripts Whether to filter core scripts.
 * @returns A list of ModuleScripts.
 */
declare function getloadedmodules(filterCoreScripts?: boolean): readonly ModuleScript[];

/**
 * Like `getinstances`, but returns only instances that are not descendants of
 * another instance.
 * @returns A list of instances.
 */
declare function getnilinstances(): readonly (Instance & { Parent: undefined })[];

/**
 * Returns the global game environment.
 * @returns A mutable table.
 */
declare function getrenv(): Record<string, unknown>;

/**
 * Returns every script that is currently running in the game.
 * @returns A list of scripts.
 */
declare function getrunningscripts(): readonly LuaSourceContainer[];

/**
 * Returns the Luau bytecode for the given script.
 * @param script The script to get the bytecode for.
 * @returns The bytecode.
 */
declare function getscriptbytecode(script: LocalScript | ModuleScript): string;

/**
 * Applies a SHA384 hash to the given script's bytecode. Can be used to detect
 * changes to the script.
 * @param script The script to get the hash for.
 * @returns The hash.
 */
declare function getscripthash(script: LocalScript | ModuleScript): string;

/**
 * Returns every script in the game.
 * @returns A list of scripts.
 */
declare function getscripts(): readonly (LocalScript | ModuleScript)[];

/**
 * Returns the identity of the current thread.
 * Learn more about thread identities: https://roblox.fandom.com/wiki/Security_context
 * @returns The thread identity.
 */
declare function getthreadidentity(): number;
/**
 * @alias getthreadidentity
 * @hidden
 */
declare const getidentity: typeof getthreadidentity | undefined;
/**
 * @alias getthreadidentity
 * @hidden
 */
declare const getthreadcontext: typeof getthreadidentity | undefined;
/**
 * @alias getthreadidentity
 * @hidden
 */
declare const get_thread_identity: typeof getthreadidentity | undefined;

/**
 * Returns whether the given property has the Scriptable tag.
 * @param object A Roblox instance..
 * @param property The property to check.
 * @returns Whether the property is Scriptable.
 */
declare function isscriptable(object: Instance, property: string): boolean;

/**
 * Sets the hidden property of a Roblox instance to `value`. Returns true if
 * the property was hidden.
 * @param instance The instance to set the property of.
 * @param property The property to set.
 * @param value The value to set the property to.
 * @returns Whether the property was hidden.
 */
declare function sethiddenproperty(instance: Instance, property: string, value: unknown): boolean;

/**
 * Sets the current thread identity to `identity`.
 * Learn more about thread identities: https://roblox.fandom.com/wiki/Security_context
 * @param identity The identity to set the thread to.
 */
declare function setidentity(identity: number): void;
/**
 * @alias setidentity
 * @hidden
 */
declare const setthreadidentity: typeof setidentity | undefined;

/**
 * Sets whether a poroperty has the Scriptable tag. Returns the original
 * Scriptable status.
 * @param object A Roblox instance.
 * @param property The property to modify.
 * @param value Whether the property is Scriptable.
 * @returns The original Scriptable status.
 */
declare function setscriptable(object: Instance, property: string, value: boolean): boolean;
