import store from "classes/store";
import config, { Store } from "lib/config";

function getInstance() {
  return store.get<number>(Store.Instance) || 0;
}

store.set(Store.Instance, getInstance() + 1);

export enum LogType {
  Print = "print",
  Debug = "debug",
  Error = "error",
}

class Log {
  private _type: LogType;
  private title: string;
  private text: string;

  private getFunction() {
    switch (this._type) {
      case LogType.Print:
        return print;
      case LogType.Debug:
        if (config.Script.Debug) return warn;
        break;
      case LogType.Error:
        return error;
    }
  }

  private log(instance: number) {
    const logFunction = this.getFunction();
    if (!logFunction) return;

    const text = `(${instance}) [${this.title}]: ${this.text}`;
    logFunction(text);
  }

  constructor(instance: number, _type: LogType, title: string, text: string) {
    this._type = _type;
    this.title = title;
    this.text = text;
    this.log(instance);
  }
}

class Logger {
  private instance: number;

  constructor() {
    this.instance = getInstance();
  }

  log(_type: LogType, title: string, text: string) {
    new Log(this.instance, _type, title, text);
  }
}

export default new Logger();
