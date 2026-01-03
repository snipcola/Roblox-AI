/**
 * The **Filesystem** library provides access to an executor's virtual file system. It enables reading, writing, creating, and deleting files and folders, as well as utility functions for interacting with content assets.
 * This library is especially useful when storing persistent data, managing resources across sessions, or loading runtime content dynamically.
 * @see https://docs.sunc.su/Filesystem
 */

/**
 * `getcustomasset` returns a content ID (e.g. `rbxasset://`) that can be used in Roblox APIs for loading audio, meshes, UI images, and other asset types.
 * @param path The file path to convert into an asset ID.
 * @returns A content ID string.
 * @example
 * const encoded = game.HttpGet("https://gitlab.com/sens3/nebunu/-/raw/main/encodedBytecode.txt");
 * writefile("ExampleSound.mp3", base64decode(encoded));
 * const assetId = getcustomasset("ExampleSound.mp3");
 * const sound = new Instance("Sound");
 * sound.Parent = workspace;
 * sound.SoundId = assetId;
 * sound.Volume = 0.35;
 * sound.Play();
 * @see https://docs.sunc.su/Filesystem/getcustomasset
 */
declare function getcustomasset(path: string): string;

/**
 * `makefolder` creates a folder at the specified path if one does not already exist.
 * @param path The folder path to create.
 * @example
 * makefolder("test_folder");
 * print(isfolder("test_folder")); // Output: true
 * @see https://docs.sunc.su/Filesystem/makefolder
 */
declare function makefolder(path: string): void;

/**
 * `appendfile` appends string content to the end of a file at the specified path. If the file does not exist, it will be created.
 * @param path The file path to append to.
 * @param contents The string content to add to the file.
 * @example
 * writefile("file4.txt", "print(");
 * appendfile("file4.txt", "'Hello')");
 * print(readfile("file4.txt")); // Output: print('Hello')
 * @see https://docs.sunc.su/Filesystem/appendfile
 */
declare function appendfile(path: string, contents: string): void;

/**
 * `isfolder` checks whether a given path exists and refers to a folder.
 * @param path The path to check.
 * @returns `true` if the path exists and is a folder, otherwise `false`.
 * @example
 * writefile("file7.txt", "");
 * makefolder("folder2");
 * print(isfolder("file7.txt")); // Output: false
 * print(isfolder("folder2"));   // Output: true
 * @see https://docs.sunc.su/Filesystem/isfolder
 */
declare function isfolder(path: string): boolean;

/**
 * `delfile` deletes the file at the specified path if it exists.
 * @param path The path of the file to delete.
 * @example
 * writefile("file5.txt", "Hello");
 * print(isfile("file5.txt")); // Output: true
 * delfile("file5.txt");
 * print(isfile("file5.txt")); // Output: false
 * @see https://docs.sunc.su/Filesystem/delfile
 */
declare function delfile(path: string): void;

/**
 * `isfile` checks whether a given path exists and refers to a file.
 * @param path The path to check.
 * @returns `true` if the path exists and is a file, otherwise `false`.
 * @example
 * print(isfile("nonexistent.txt")); // Output: false
 * writefile("file3.txt", "");
 * print(isfile("file3.txt")); // Output: true
 * @see https://docs.sunc.su/Filesystem/isfile
 */
declare function isfile(path: string): boolean;

/**
 * `writefile` writes data to a file at the specified path. If the file already exists, its contents will be overwritten.
 * @param path The file path to write to.
 * @param data The string data to write into the file.
 * @example
 * writefile("file.txt", "Hello world");
 * print(readfile("file.txt")); // Output: Hello world
 * @see https://docs.sunc.su/Filesystem/writefile
 */
declare function writefile(path: string, data: string): void;

/**
 * `loadfile` compiles the Luau source code from a file and returns the resulting function (chunk). This chunk runs in the global environment.
 * @param path The path to the file to be loaded.
 * @returns A tuple where the first element is the compiled function (or `nil` on error) and the second element is an error message (if any).
 * @example
 * writefile("file6.lua", "return 10 + ...");
 * const [chunk] = loadfile("file6.lua");
 * print(chunk(1)); // Output: 11
 * @example
 * writefile("file6.lua", "retrn 10 + ...");
 * loadfile("file6.lua"); // This will throw an error in the console
 * @see https://docs.sunc.su/Filesystem/loadfile
 */
declare function loadfile<A extends Array<any> = Array<any>>(
  path: string,
): LuaTuple<[((...args: A) => any) | undefined, string | undefined]>;

/**
 * `delfolder` deletes the folder at the specified path if it exists.
 * @param path The path of the folder to delete.
 * @example
 * makefolder("folder3");
 * print(isfolder("folder3")); // Output: true
 * delfolder("folder3");
 * print(isfolder("folder3")); // Output: false
 * @see https://docs.sunc.su/Filesystem/delfolder
 */
declare function delfolder(path: string): void;

/**
 * `readfile` retrieves the contents of a file at the specified path and returns it as a string.
 * @param path The file path to read from.
 * @returns The contents of the file as a string.
 * @example
 * writefile("file0.txt", "Hello");
 * print(readfile("file0.txt")); // Output: Hello
 * @see https://docs.sunc.su/Filesystem/readfile
 */
declare function readfile(path: string): string;

/**
 * `listfiles` returns an array of strings representing all files and folders within the specified directory.
 * @param path The path to the directory to scan.
 * @returns An array of file and folder names.
 * @example
 * writefile("file1.txt", "");
 * writefile("file2.lua", "");
 * task.wait();
 * for (const file of listfiles("")) {
 *     if (file === "file1.txt") {
 *         print(`Found: ${file}`); // Output: Found: file1.txt
 *     }
 *     if (file === "file2.lua") {
 *         print(`Found: ${file}`); // Output: Found: file2.lua
 *     }
 * }
 * @see https://docs.sunc.su/Filesystem/listfiles
 */
declare function listfiles(path: string): Array<string>;
