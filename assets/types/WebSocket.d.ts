/**
 * The `WebSocket` class provides a lightweight interface for establishing and working with WebSocket connections.
 * It allows scripts to **send** and **receive** messages over a persistent connection to a [WebSocket](https://en.wikipedia.org/wiki/WebSocket) server.
 * @see https://docs.sunc.su/WebSocket
 */

/**
 * Represents a WebSocket event that can be connected to with callbacks.
 */
interface WebSocketEvent<T extends (...args: any[]) => void> {
  /**
   * Connects a callback function to this event.
   * @param callback The function to call when the event fires.
   */
  Connect(callback: T): void;
}

interface WebSocket {
  /**
   * Sends data through the WebSocket connection.
   * @param data The data to send to the server. If the data is a string, it is sent as text. Otherwise, it is sent as binary.
   */
  Send(data: string): void;

  /**
   * Closes the WebSocket connection, optionally with a code and reason.
   * @param code A numeric value indicating the status code explaining why the connection is being closed.
   * @param reason A human-readable string explaining why the connection is closing.
   */
  Close(): void;

  /**
   * An event that fires when a message is received from the server.
   */
  OnMessage: WebSocketEvent<(data: string) => void>;

  /**
   * An event that fires when the WebSocket connection is closed.
   */
  OnClose: WebSocketEvent<() => void>;
}

interface WebSocketConstructor {
  /**
   * Connects to a WebSocket server at the specified URL.
   * @param url The URL of the WebSocket server to connect to.
   * @returns A new WebSocket instance connected to the given URL.
   * @example
   * const ws = WebSocket.connect("wss://ws.postman-echo.com/raw");
   * ws.OnMessage.Connect((message: string) => {
   *     print(message);
   * });
   * ws.Send("Hello"); // Output: Hello
   * @example
   * const ws = WebSocket.connect("wss://ws.postman-echo.com/raw");
   * ws.OnClose.Connect(() => {
   *     print("Closed");
   * });
   * ws.Close(); // Output: Closed
   */
  connect(url: string): WebSocket;
}

declare const WebSocket: WebSocketConstructor;
