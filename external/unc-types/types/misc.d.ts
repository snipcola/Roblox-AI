// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/misc

/**
 * Returns a valid content id for the given file (i.e. `rbxasset://`), allowing
 * you to use custom assets. Internally, this copies the file to Roblox's
 * content directory.
 *
 * If `preventcache` is true, the file will not be cached, allowing subsequent
 * calls to `getcustomasset` to update the content id.
 *
 * @param file The file to get the content id for.
 * @param preventcache Whether to prevent caching the file.
 * @returns The content id for the given file.
 *
 * @example
 * const image = new Instance("ImageLabel");
 * image.Image = getcustomasset("files/face.png");
 */
declare function getcustomasset(file: string, preventcache?: boolean): string;

/**
 * Returns the name and version of the current executor.
 * @returns The name and version.
 */
declare function identifyexecutor(): LuaTuple<[string, string]>;
/**
 * @alias identifyexecutor
 * @hidden
 */
declare const getexecutorname: typeof identifyexecutor | undefined;

/**
 * Compresses the given string using the LZ4 compression algorithm.
 * @param string The string to compress.
 * @returns The compressed string.
 */
declare function lz4compress(string: string): string;

/**
 * Decompresses the given string using the LZ4 compression algorithm, with the
 * size of the original string as the second parameter.
 * @param string The string to decompress.
 * @param size The size of the original string.
 * @returns The decompressed string.
 */
declare function lz4decompress(string: string, size: number): string;

/**
 * Creates a message box with the given text and caption. Yields until the
 * message box is closed, and returns the user input.
 *
 * Documentation regarding the flags can be found [here](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messagebox).
 * Multiple flags can be set with the `bit32` library or a pre-made integer.
 *
 * @param text The text to display in the message box.
 * @param caption The caption to display in the message box.
 * @param flags The flag integer.
 * @returns The user input integer.
 */
declare function messagebox(text: string, caption: string, flags: number): number;

/**
 * Queues the given script to execute after a successful TeleportService
 * teleport.
 * @param script The script to execute.
 */
declare function queue_on_teleport(script: string): void;
/**
 * @alias queue_on_teleport
 * @hidden
 */
declare const queueonteleport: typeof queue_on_teleport | undefined;

/**
 * Creates an HTTP request using the given options. Yields until the request
 * is complete, and returns the response.
 *
 * ### Headers
 *
 * The prefix is required for identifying the executor on a web-server.
 *
 * - **`PREFIX-User-Identifier`** - This is data that is specified to each user,
 *   and does not change if the script executor gets used across computers.
 *   Implementation defined.
 * - **`PREFIX-Fingerprint`** - This is the Hardware ID of the user. Implementation
 *   defined.
 * - **`User-Agent`** - An identifier of the executor and the version.
 *
 * @param options The options to use.
 * @returns The HTTP response.
 *
 * @example
 * request({ Method: "GET", Url: "https://example.com" });
 */
declare function request(options: RequestAsyncRequest): RequestAsyncResponse;
/**
 * @alias request
 * @hidden
 */
declare const http_request: typeof request | undefined;

/**
 * Copies the given text to the clipboard.
 * @param text The text to copy.
 */
declare function setclipboard(text: string): void;
/**
 * @alias setclipboard
 * @hidden
 */
declare const toclipboard: typeof setclipboard | undefined;

/**
 * Sets the in-game FPS cap to `frames`. Setting this to `0` will disable the
 * FPS cap.
 * @param frames The FPS cap.
 */
declare function setfpscap(frames: number): void;
