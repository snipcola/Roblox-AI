import logger, { LogType } from "classes/logger";
import store from "classes/store";

interface ConnectionOptions {
  key: string;
  signal: RBXScriptSignal | ((callback: Callback) => RBXScriptConnection);
  callback: Callback;
  check?: boolean;
}

export class Connection {
  private options: ConnectionOptions;
  private connection?: RBXScriptConnection;

  private get(): RBXScriptConnection | undefined {
    return store.get(this.options.key) || this.connection;
  }

  private set(connection?: RBXScriptConnection) {
    this.connection = connection;
    store.set(this.options.key, connection);
  }

  private connect() {
    const { key, signal, callback, check } = this.options;

    if (typeIs(check, "boolean") && !check) {
      return;
    }

    const connection = typeIs(signal, "RBXScriptSignal")
      ? signal.Connect(callback)
      : signal(callback);

    this.set(connection);

    if (this.connection) logger.log(LogType.Debug, key, "Connected");
    else logger.log(LogType.Error, key, "Failed to connect");
  }

  private disconnect() {
    const connection = this.get();

    if (connection?.Connected) {
      connection.Disconnect();
      logger.log(LogType.Debug, this.options.key, "Disconnected");
    }

    this.set();
  }

  constructor(options: ConnectionOptions) {
    this.options = options;
    this.disconnect();
    this.connect();
  }
}
