import log from "log";
import config from "config";

const players = game.GetService("Players");
const localPlayer = players.LocalPlayer;

export function waitForGameLoad() {
  log("debug", "Script", "Waiting for game load");
  game.IsLoaded() || game.Loaded.Wait();
}

export function isLocalPlayer(player: Player): boolean {
  return player === localPlayer;
}

export function isTagged(message: string): boolean {
  const match = message.match("^#+$");
  return match?.size() > 0;
}

export function executeCode(code: string) {
  const [callback, _error] = loadstring(code);
  log("debug", "Execute", code);

  if (_error) {
    log("error", "Execute", _error);
  } else if (callback) {
    try {
      callback();
    } catch {
      log("error", "Execute", code);
    }
  }
}

function playerInDistance(player: Player): boolean {
  if (!config.Settings.MinimumDistance) {
    return true;
  }

  const position =
    player.Character && localPlayer?.Character?.PrimaryPart?.Position;

  return position
    ? player.DistanceFromCharacter(position) <= config.Settings.MinimumDistance
    : false;
}

function isWhitelisted(player: Player) {
  const whitelist = config.Script.Whitelist;
  return whitelist.size() === 0 || whitelist.includes(player.Name);
}

function isBlacklisted(player: Player) {
  return config.Script.Blacklist.includes(player.Name);
}

export function isPlayerAllowed(player: Player) {
  return (
    playerInDistance(player) && isWhitelisted(player) && !isBlacklisted(player)
  );
}

export function getPlayerHumanoid(player: Player) {
  return player.Character?.FindFirstChildOfClass("Humanoid");
}

export function getPlayerPrimaryPart(player: Player) {
  return player.Character?.PrimaryPart;
}

function startsWith(one: string, two: string) {
  return one.sub(1, two.size()) === two;
}

export function getPlayerFromPartialName(name: string): Player | undefined {
  name = name.lower();

  return players
    .GetPlayers()
    .filter((p) => p !== localPlayer)
    .find(function ({ Name, DisplayName }) {
      Name = Name.lower();
      DisplayName = DisplayName.lower();

      return (
        [Name, DisplayName].includes(name) ||
        startsWith(Name, name) ||
        startsWith(DisplayName, name)
      );
    });
}
