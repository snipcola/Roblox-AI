/**
 * The **Miscellaneous** library contains functions that do not belong to a specific category.
 * @see https://docs.sunc.su/Miscellaneous
 */

interface RequestOptions {
  /** The URL to send the request to. */
  Url: string;
  /** The HTTP method to use. */
  Method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH";
  /** Optional request body. */
  Body?: string;
  /** Optional request headers. */
  Headers?: { [key: string]: string };
  /** Optional cookies. */
  Cookies?: { [key: string]: string };
}

interface Response {
  /** Whether the request was successful. */
  Success: boolean;
  /** The response body. */
  Body: string;
  /** The HTTP status code. */
  StatusCode: number;
  /** The HTTP status message. */
  StatusMessage: string;
  /** The response headers. */
  Headers: { [key: string]: string };
}

/**
 * `request` sends a [HTTP request](https://en.wikipedia.org/wiki/HTTP) to the given URL using the provided configuration table. It yields until the request is complete and returns a structured response.
 * @param options The request configuration.
 * @returns The response object.
 * @example
 * const response = request({
 *     Url: "http://httpbin.org/get",
 *     Method: "GET",
 * });
 * const decoded = game.GetService("HttpService").JSONDecode(response.Body);
 * let retrievedFingerprint: string | undefined;
 * for (const key in decoded.headers) {
 *     if (key.match("Fingerprint")) {
 *         retrievedFingerprint = key;
 *         break;
 *     }
 * }
 * print(response.StatusCode);         // Output: 200
 * print(response.Success);            // Output: true
 * print(retrievedFingerprint);        // Output: PREFIX-Fingerprint
 * @example
 * const response = request({
 *     Url: "http://httpbin.org/post",
 *     Method: "POST",
 *     Body: "Example"
 * });
 * print(response.StatusMessage);                               // Output: OK
 * print(response.StatusCode);                                  // Output: 200
 * print(game.GetService("HttpService").JSONDecode(response.Body).data); // Output: Example
 * @see https://docs.sunc.su/Miscellaneous/request
 */
declare function request(options: RequestOptions): Response;

/**
 * `identifyexecutor` returns the name and version of the currently running executor.
 * @returns A tuple where the first element is the executor name and the second is the version.
 * @example
 * const [execName, execVersion] = identifyexecutor();
 * print(execName, execVersion); // Output: "YourExploitName 0.0.1"
 * @see https://docs.sunc.su/Miscellaneous/identifyexecutor
 */
declare function identifyexecutor(): LuaTuple<[string, string]>;
