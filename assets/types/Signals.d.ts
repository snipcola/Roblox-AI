/**
 * The **Signals** library provides functions for inspecting and manipulating [`RBXScriptSignal`](https://create.roblox.com/docs/reference/engine/datatypes/RBXScriptSignal) and [`RBXScriptConnection`](https://create.roblox.com/docs/reference/engine/datatypes/RBXScriptConnection) objects.
 * @see https://docs.sunc.su/Signals
 */

/**
 * A Connection object represents an active link to a signal's callback.
 * These are returned by `getconnections` and allow inspection and manipulation over connections/signals.
 */
interface Connection {
  /**
   * Whether the connection is currently active and will respond to events.
   */
  Enabled: boolean;

  /**
   * `true` if the connection was made from a foreign Luau state (e.g. CoreScript).
   */
  ForeignState: boolean;

  /**
   * `true` if the connection was created from Luau, not C.
   */
  LuaConnection: boolean;

  /**
   * The bound function.
   */
  Function: Callback;

  /**
   * The thread that created the connection, or `nil` in foreign or non-Luau contexts.
   */
  Thread: thread | undefined;

  /**
   * Fires the connected function with given arguments.
   * @param args The arguments to pass to the connected function.
   */
  Fire(...args: Array<any>): void;

  /**
   * Defers execution using `task.defer`.
   * @param args The arguments to pass to the connected function.
   */
  Defer(...args: Array<any>): void;

  /**
   * Disconnects the connection from the signal.
   */
  Disconnect(): void;

  /**
   * Prevents the connection from receiving events.
   */
  Disable(): void;

  /**
   * Re-enables a previously disabled connection.
   */
  Enable(): void;
}

/**
 * `getconnections` retrieves a list of [`Connection`](https://docs.sunc.su/Signals/Connection) objects currently attached to a given [`RBXScriptSignal`](https://create.roblox.com/docs/reference/engine/datatypes/RBXScriptSignal).
 * @param signal The signal to inspect for active connections.
 * @returns An array of Connection objects.
 * @example
 * const folder = new Instance("Folder");
 * folder.ChildAdded.Connect(() => {
 *     return "Triggered";
 * });
 * const connection = getconnections(folder.ChildAdded)[0]; // First connection in the list
 * print(connection.Function());     // Output: Triggered
 * print(connection.Fire()); // Same as above, Output: Triggered
 * print(typeof connection.Thread); // Output: object
 * @example
 * const cconnection = getconnections(game.Players.LocalPlayer.Idled)[0];
 * print(cconnection.Function);  // Output: null
 * print(cconnection.Thread);    // Output: null
 * @see https://docs.sunc.su/Signals/getconnections
 */
declare function getconnections(signal: RBXScriptSignal): Array<Connection>;

/**
 * `firesignal` Invokes all Luau [connections](https://create.roblox.com/docs/reference/engine/datatypes/RBXScriptConnection) connected to a given [`RBXScriptSignal`](https://create.roblox.com/docs/reference/engine/datatypes/RBXScriptSignal).
 * @param signal The signal whose connections you want to manually fire.
 * @param args The arguments to pass to the connected functions.
 * @example
 * const part = new Instance("Part");
 * part.ChildAdded.Connect((arg1: Instance) => {
 *     print(typeof arg1);
 * });
 * firesignal(part.ChildAdded);            // Output: undefined
 * firesignal(part.ChildAdded, workspace); // Output: Instance
 * @see https://docs.sunc.su/Signals/firesignal
 */
declare function firesignal(signal: RBXScriptSignal, ...args: Array<any>): void;

/**
 * `replicatesignal` replicates a signal to the server with the provided arguments, if possible. The arguments must also match accordingly to the signal itself. To know a signal's arguments, visit [this](https://robloxapi.github.io/ref/).
 * @param signal The signal to replicate to the server.
 * @param args Arguments to pass to the signal.
 * @example
 * const detector = workspace.replicatesigmal.ClickDetector;
 * replicatesignal(detector.MouseActionReplicated, game.Players.LocalPlayer, 0);
 * task.wait(0.1);
 * print(game.Players.LocalPlayer.GetAttribute("MouseClickReplicated")); // Output: true
 * @example
 * const ui_frame = game.Players.LocalPlayer.PlayerGui.ScreenGui.Frame;
 * // These will throw an error.
 * replicatesignal(ui_frame.MouseWheelForward);
 * replicatesignal(ui_frame.MouseWheelForward, 121);
 * // This succeeds
 * replicatesignal(ui_frame.MouseWheelForward, 121, 214);
 * task.wait(0.1);
 * print(game.Players.LocalPlayer.GetAttribute("MouseWheelForwardReplicated")); // Output: true
 * @see https://docs.sunc.su/Signals/replicatesignal
 */
declare function replicatesignal(
  signal: RBXScriptSignal,
  ...args: Array<any>
): void;
