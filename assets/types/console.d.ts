// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/console

/**
 * Clears the console window.
 */
declare function rconsoleclear(): void;
/**
 * @alias rconsoleclear
 * @hidden
 */
declare const consoleclear: typeof rconsoleclear | undefined;

/**
 * Opens an empty console window.
 */
declare function rconsolecreate(): void;
/**
 * @alias rconsolecreate
 * @hidden
 */
declare const consolecreate: typeof rconsolecreate | undefined;

/**
 * Closes the console window after clearing it.
 */
declare function rconsoledestroy(): void;
/**
 * @alias rconsoledestroy
 * @hidden
 */
declare const consoledestroy: typeof rconsoledestroy | undefined;

/**
 * Waits for the user to input text into the console window. Returns the text.
 * @returns The text entered by the user.
 */
declare function rconsoleinput(): string;
/**
 * @alias rconsoleinput
 * @hidden
 */
declare const consoleinput: typeof rconsoleinput | undefined;

/**
 * Prints the text to the console window. Some engines may allow you to change
 * text color via `@@@RED@@@`, `@@@BLUE@@@`, etc.
 * @param text The text to print.
 */
declare function rconsoleprint(text: string): void;
/**
 * @alias rconsoleprint
 * @hidden
 */
declare const consoleprint: typeof rconsoleprint | undefined;

/**
 * Sets the title of the console window.
 * @param title The title to set.
 */
declare function rconsolesettitle(title: string): void;
/**
 * @alias rconsolesettitle
 * @hidden
 */
declare const rconsolename: typeof rconsolesettitle | undefined;
/**
 * @alias rconsolesettitle
 * @hidden
 */
declare const consolesettitle: typeof rconsolesettitle | undefined;
