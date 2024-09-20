import config from "config";
import store from "store";
import log from "log";
import { executeCode } from "functions";

const players = game.GetService("Players");
const localPlayer = players.LocalPlayer;

let connection: RBXScriptConnection | undefined = store.get("AntiAFK");

function disconnectEvent() {
  if (connection?.Connected) {
    connection.Disconnect();
    log("debug", "AntiAFK", "Disconnected");
  }

  connection = undefined;
  store.set("AntiAFK", connection);
}

function connectEvent() {
  if (!config.Settings.AntiAFK) {
    return;
  }

  connection = localPlayer.Idled.Connect(function () {
    executeCode(`
      local virtualUser = game:GetService("VirtualUser")
      virtualUser:CaptureController()
			virtualUser:ClickButton2(Vector2.new())
    `);
  });

  store.set("AntiAFK", connection);
  log("debug", "AntiAFK", "Connected");
}

function initialize() {
  disconnectEvent();
  connectEvent();
}

export default {
  initialize,
};
