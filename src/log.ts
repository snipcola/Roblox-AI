import store from "store";
import config from "config";

const instance: number = (store.get<number>("InstanceNumber") || 0) + 1;
store.set("InstanceNumber", instance);

function log(func: (message: string) => void, title: string, message: string) {
  func(`(${instance}) [${title}]: ${message}`);
}

export default function (
  _type: "print" | "debug" | "error",
  title: string,
  message: string,
) {
  switch (_type) {
    case "print":
      log(print, title, message);
      break;
    case "debug":
      if (config.Script.Debug) log(warn, title, message);
      break;
    case "error":
      log(error, title, message);
      break;
  }
}
