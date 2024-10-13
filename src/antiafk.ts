import config from "config";
import store from "store";
import log from "log";

const players = game.GetService("Players");
const localPlayer = players.LocalPlayer;

let connection: RBXScriptConnection | undefined = store.get("AntiAFK");

interface VirtualUser {
  CaptureController(): undefined;
  ClickButton2(position: Vector2, camera?: CFrame): undefined;
}

type PossiblyVirtualUser = VirtualUser | undefined;
let VirtualUser: PossiblyVirtualUser;

try {
  VirtualUser = game.FindService("VirtualUser") as PossiblyVirtualUser;
} catch {
  log("error", "AntiAFK", "VirtualUser not found.");
}

function disconnectEvent() {
  if (connection?.Connected) {
    connection.Disconnect();
    log("debug", "AntiAFK", "Disconnected");
  }

  connection = undefined;
  store.set("AntiAFK", connection);
}

function connectEvent() {
  if (VirtualUser && config.Settings.AntiAFK) {
    connection = localPlayer.Idled.Connect(function () {
      VirtualUser.CaptureController();
      VirtualUser.ClickButton2(new Vector2());
    });

    store.set("AntiAFK", connection);
    log("debug", "AntiAFK", "Connected");
  }
}

function initialize() {
  disconnectEvent();
  connectEvent();
}

export default {
  initialize,
};
