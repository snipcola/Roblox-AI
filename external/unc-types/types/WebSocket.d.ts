// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/websockets

interface WebSocketEvent<T extends Callback> {
	// TODO: Check if event connections are missing documentation
	Connect(callback: T): void;
}

/**
 * Handles websocket connections.
 * @example
 * const socket = WebSocket.connect("ws://localhost:8080");
 * socket.OnMessage.Connect((message) => print(message));
 * socket.OnClose.Connect(() => print("Websocket closed"));
 * socket.Send("Hello, world!");
 */
interface WebSocket {
	/**
	 * Sends a message to the server.
	 * @param message The message to send.
	 */
	Send(message: string): void;

	/**
	 * Closes the connection.
	 * @fires WebSocket.OnClose
	 */
	Close(): void;

	/**
	 * Fired when the Websocked is closed, either by the server or by the client.
	 */
	OnClose: WebSocketEvent<() => void>;

	/**
	 * Fired when the Websocket receives a message.
	 * @param message The message received.
	 */
	OnMessage: WebSocketEvent<(message: string) => void>;
}

interface WebSocketConstructor {
	/**
	 * Attempts to connect to the given websocket URL.
	 * @param url The URL to connect to.
	 * @returns The WebSocket object.
	 * @example
	 * const socket = WebSocket.connect("ws://localhost:8080");
	 * socket.OnMessage.Connect((message) => print(message));
	 * socket.OnClose.Connect(() => print("Websocket closed"));
	 * socket.Send("Hello, world!");
	 */
	connect: (url: string) => WebSocket;
}

/**
 * Handles websocket connections.
 * @example
 * const socket = WebSocket.connect("ws://localhost:8080");
 * socket.OnMessage.Connect((message) => print(message));
 * socket.OnClose.Connect(() => print("Websocket closed"));
 * socket.Send("Hello, world!");
 */
declare const WebSocket: WebSocketConstructor;
