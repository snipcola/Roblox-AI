/**
 * Sets the environment to be used by the given function. `fn` can be a Lua
 * function or a number that specifies the function at that stack level: Level
 * 1 is the function calling `setfenv`. `setfenv` returns the given function.
 *
 * As a special case, when `fn` is 0, setfenv changes the environment of the
 * running thread. In this case, setfenv returns no values.
 *
 * @param fn A Lua function or the stack level.
 * @param environment The new environment.
 */
declare function setfenv<T extends number | Callback>(fn: T, environment: object): T extends 0 ? undefined : T;

interface DataModel {
	/**
	 * Sends a HTTP GET request to the given URL and returns the response body.
	 */
	HttpGetAsync(
		this: DataModel,
		url: string,
		httpRequestType?: Enum.HttpRequestType,
	): LuaTuple<[body: string, code: number]>;

	/**
	 * Sends a POST request to the specified url, using the specified data and contentType.
	 */
	HttpPostAsync(
		this: DataModel,
		url: string,
		data: string,
		contentType?: string,
		httpRequestType?: Enum.HttpRequestType,
	): string;
}
