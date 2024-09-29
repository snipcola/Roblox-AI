import log from "log";
import config from "config";

const httpService = game.GetService("HttpService");
const players = game.GetService("Players");
const localPlayer = players.LocalPlayer;

export function waitForGameLoad() {
  log("debug", "Script", "Waiting for game load");
  if (!game.IsLoaded()) game.Loaded.Wait();
}

export function isLocalPlayer(player: Player): boolean {
  return player === localPlayer;
}

export function isTagged(message: string): boolean {
  const match = message.match("^#+$");
  return match?.size() > 0;
}

export function executeCode(code: string, logCode?: boolean) {
  if (!loadstring) {
    log("error", "Execute", "Loadstring function unavailable.");
    return;
  }

  const [callback, _error] = loadstring(code);
  if (logCode) log("debug", "Execute", code);

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

export function isPlayerInAir(player: Player): boolean {
  return (
    getPlayerHumanoid(player)?.GetState() === Enum.HumanoidStateType.Freefall
  );
}

export function jump(): boolean {
  const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

  if (!isPlayerInAir(localPlayer) && localPlayerHumanoid) {
    localPlayerHumanoid.ChangeState(Enum.HumanoidStateType.Jumping);
    return true;
  }

  return false;
}

interface Header {
  Name: string;
  Value: string;
}

type Headers = Array<Header>;

export interface HttpResponse {
  Success: boolean;
  Body: string;
}

export function sendRequest(
  url: string,
  method: "GET" | "POST",
  headers: Headers,
  body: string | object,
): HttpResponse | undefined {
  if (!(request || httpService.RequestAsync)) {
    log("error", "Request", "Request function unavailable.");
    return;
  }

  const args = {
    Url: url,
    Method: method,
    Headers: headers.reduce(
      (acc, { Name, Value }) => {
        acc[Name] = Value;
        return acc;
      },
      {} as Record<string, string>,
    ),
    Body: typeIs(body, "string") ? body : httpService.JSONEncode(body),
    Compress: Enum.HttpCompression.Gzip,
  };

  const { Success, Body } = request
    ? request(args)
    : httpService.RequestAsync(args);

  return { Success, Body };
}
