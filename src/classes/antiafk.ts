import config, { Store } from "lib/config";
import { getCustomService } from "lib/functions";
import logger, { LogType } from "classes/logger";
import players from "classes/players";
import { Connection } from "classes/connection";

const localPlayer = players.localPlayer();

interface VirtualUser {
  CaptureController(): undefined;
  ClickButton2(position: Vector2, camera?: CFrame): undefined;
}

type PossiblyVirtualUser = VirtualUser | undefined;
let VirtualUser: PossiblyVirtualUser;

try {
  VirtualUser = getCustomService<PossiblyVirtualUser>("VirtualUser");
} catch {
  logger.log(LogType.Error, "AntiAFK", "VirtualUser not found.");
}

export default function () {
  return new Connection({
    key: Store.AntiAFK,
    signal: (callback: Callback) => localPlayer.onIdled(callback),
    callback: () => {
      if (!VirtualUser) return;
      VirtualUser.CaptureController();
      VirtualUser.ClickButton2(new Vector2());
    },
    check: VirtualUser && config.Settings.AntiAFK,
  });
}
