/**
 * The **Instances** library provides direct access to and manipulation of [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) objects in the game world. It includes tools for listing, referencing, and firing Roblox-native interactions.
 * These functions are especially useful for inspecting hidden instances, working with UI safely, or simulating player interactions with in-game objects.
 * @see https://docs.sunc.su/Instances
 */

/**
 * `cloneref` returns a **reference clone** of an [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance). The returned object behaves identically to the original but is not strictly equal (`==`) to it.
 * @param object The [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) to clone a safe reference from.
 * @returns A cloned reference of the original instance.
 * @example
 * const players = game.GetService("Players");
 * const original = players.LocalPlayer;
 * const clone = cloneref(original);
 * print(original === clone); // Output: false
 * print(clone.Name);        // Output: Player's name (same as original)
 * @see https://docs.sunc.su/Instances/cloneref
 */
declare function cloneref<T extends Instance>(object: T): T;

/**
 * `getcallbackvalue` retrieves the **assigned callback property** on an [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance), such as [`OnInvoke`](https://create.roblox.com/docs/reference/engine/classes/BindableFunction#OnInvoke).
 * @param object The [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) that owns the callback property.
 * @param property The name of the callback property to retrieve.
 * @returns The value of the callback property, or `nil` if not found.
 * @example
 * const dummyBindable = new Instance("BindableFunction");
 * const dummyRemoteFunction = new Instance("RemoteFunction");
 * dummyBindable.OnInvoke = () => {
 *     print("Hello from callback!");
 * };
 * const retrieved = getcallbackvalue(dummyBindable, "OnInvoke");
 * retrieved(); // Output: Hello from callback!
 * print(getcallbackvalue(dummyRemoteFunction, "OnClientInvoke")); // Output: null
 * @see https://docs.sunc.su/Instances/getcallbackvalue
 */
declare function getcallbackvalue(
  object: Instance,
  property: string,
): any | undefined;

/**
 * `fireclickdetector` triggers a [`ClickDetector`](https://create.roblox.com/docs/reference/engine/classes/ClickDetector) event. By default, it fires the [`MouseClick`](https://create.roblox.com/docs/reference/engine/classes/ClickDetector#MouseClick) event.
 * @param detector The [`ClickDetector`](https://create.roblox.com/docs/reference/engine/classes/ClickDetector) to trigger.
 * @param distance? Distance from which the click is simulated. Defaults to infinite.
 * @param event? The event to trigger.
 * @example
 * const clickDetector = new Instance("ClickDetector");
 * clickDetector.MouseClick.Connect((player: Player) => {
 *     print(`${player.Name} Fired M1`);
 * });
 * clickDetector.RightMouseClick.Connect((player: Player) => {
 *     print(`${player.Name} Fired M2`);
 * });
 * clickDetector.MouseHoverEnter.Connect((player: Player) => {
 *     print(`${player.Name} Fired HoverEnter`);
 * });
 * clickDetector.MouseHoverLeave.Connect((player: Player) => {
 *     print(`${player.Name} Fired HoverLeave`);
 * });
 * fireclickdetector(clickDetector, 0, "MouseClick"); // Output: Player Fired M1
 * fireclickdetector(clickDetector, 0, "RightMouseClick"); // Output: Player Fired M2
 * fireclickdetector(clickDetector, 0, "MouseHoverEnter"); // Output: Player Fired HoverEnter
 * fireclickdetector(clickDetector, 0, "MouseHoverLeave"); // Output: Player Fired HoverLeave
 * @see https://docs.sunc.su/Instances/fireclickdetector
 */
declare function fireclickdetector(
  detector: ClickDetector,
  distance?: number,
  event?: string,
): void;

/**
 * `gethui` returns a **hidden [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance)** container used for safely storing UI elements. This container is mainly designed to **avoid detections**.
 * @returns A hidden container for UI elements, typically a `BasePlayerGui` or `Folder`.
 * @example
 * const hui = gethui();
 * const gui = new Instance("ScreenGui");
 * gui.Parent = hui;
 * gui.Name = "GUI";
 * const label = new Instance("TextLabel");
 * label.Size = UDim2.fromOffset(200, 50);
 * label.Text = "Hello from gethui!";
 * label.Parent = gui;
 * print(hui.FindFirstChild("GUI")); // Output: GUI
 * @see https://docs.sunc.su/Instances/gethui
 */
declare function gethui(): BasePlayerGui | Folder;

/**
 * `fireproximityprompt` instantly triggers a [`ProximityPrompt`](https://create.roblox.com/docs/reference/engine/classes/ProximityPrompt), bypassing its [`HoldDuration`](https://create.roblox.com/docs/reference/engine/classes/ProximityPrompt#HoldDuration) and activation distance.
 * @param prompt The [`ProximityPrompt`](https://create.roblox.com/docs/reference/engine/classes/ProximityPrompt) to trigger.
 * @example
 * const part = new Instance("Part");
 * part.Parent = workspace;
 * const prompt = new Instance("ProximityPrompt");
 * prompt.Parent = part;
 * prompt.ActionText = "Click Me";
 * prompt.Triggered.Connect((player: Player) => {
 *     print(`${player.Name} triggered the prompt`);
 * });
 * fireproximityprompt(prompt); // Output: [YourName] triggered the prompt
 * @see https://docs.sunc.su/Instances/fireproximityprompt
 */
declare function fireproximityprompt(prompt: ProximityPrompt): void;

/**
 * `compareinstances` checks if two [`Instances`](https://create.roblox.com/docs/reference/engine/classes/Instance) are equal.
 * @param object1 The first [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) to compare.
 * @param object2 The second [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) to compare against.
 * @returns `true` if the two instances are equal, otherwise `false`.
 * @example
 * print(compareinstances(game, game));              // true
 * print(compareinstances(game, workspace));         // false
 * print(compareinstances(game, cloneref(game)));    // true
 * print(game === cloneref(game));                    // false
 * @see https://docs.sunc.su/Instances/compareinstances
 */
declare function compareinstances(
  object1: Instance,
  object2: Instance,
): boolean;

/**
 * `getnilinstances` returns a list of [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance) objects that are **currently unparented**. These instances exist in memory but are no longer part of the [`DataModel`](https://create.roblox.com/docs/reference/engine/classes/DataModel) hierarchy.
 * @returns An array of unparented instances.
 * @example
 * const part = new Instance("Part");
 * for (const instance of getnilinstances()) {
 *     if (instance === part) {
 *         print("Found our unattached part!");
 *     }
 * }
 * @see https://docs.sunc.su/Instances/getnilinstances
 */
declare function getnilinstances(): Array<Instance>;

/**
 * `getinstances` retrieves **every [`Instance`](https://create.roblox.com/docs/reference/engine/classes/Instance)** from the registry. Which means that instances that are/were parented to `nil` will also be returned.
 * @returns An array of all instances in the registry.
 * @example
 * const dummyPart = new Instance("Part");
 * dummyPart.Parent = null;
 * for (const instance of getinstances()) {
 *     if (instance === dummyPart) {
 *         print("Found the dummy part!");
 *     }
 * }
 * @see https://docs.sunc.su/Instances/getinstances
 */
declare function getinstances(): Array<Instance>;

/**
 * `firetouchinterest` simulates a physical touch event between two [`BasePart`](https://create.roblox.com/docs/reference/engine/classes/BasePart) objects. It can emulate both the start and end of a [`Touched`](https://create.roblox.com/docs/reference/engine/classes/BasePart#Touched) event.
 * @param part1 The initiating [`BasePart`](https://create.roblox.com/docs/reference/engine/classes/BasePart).
 * @param part2 The [`BasePart`](https://create.roblox.com/docs/reference/engine/classes/BasePart) that should be touched.
 * @param toggle Whether to simulate touch start or end. `true` or `0` simulates touch; `false` or `1` simulates un-touch.
 * @example
 * const dummyPart = new Instance("Part");
 * dummyPart.CFrame = new CFrame(0, -200, 0);
 * dummyPart.Anchored = true;
 * dummyPart.Parent = workspace;
 * dummyPart.Touched.Connect((part: BasePart) => {
 *     print(`${part.Name} touched the dummy part!`);
 * });
 * const playerHead = game.Players.LocalPlayer.Character.Head;
 * firetouchinterest(playerHead, dummyPart, true); // Simulate touch
 * task.wait(0.5);
 * firetouchinterest(playerHead, dummyPart, false); // Simulate un-touch
 * @example
 * const dummyPart = new Instance("Part");
 * dummyPart.CFrame = new CFrame(0, -200, 0);
 * dummyPart.Anchored = true;
 * dummyPart.Parent = workspace;
 * dummyPart.Touched.Connect((part: BasePart) => {
 *     print(`${part.Name} touched the dummy part!`);
 * });
 * const playerHead = game.Players.LocalPlayer.Character.Head;
 * firetouchinterest(playerHead, dummyPart, 0); // Simulate touch
 * task.wait(0.5);
 * firetouchinterest(playerHead, dummyPart, 1); // Simulate un-touch
 * @see https://docs.sunc.su/Instances/firetouchinterest
 */
declare function firetouchinterest(
  part1: BasePart,
  part2: BasePart,
  toggle: boolean | number,
): void;
