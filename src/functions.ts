import log from "log";
import config from "config";

const httpService = game.GetService("HttpService");
const tweenService = game.GetService("TweenService");

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
  return !match?.isEmpty();
}

function playerInDistance(player: Player): boolean {
  if (!(config.Settings.MinimumDistance && getPlayerRootPart(player))) {
    return true;
  }

  const position = getPlayerRootPart(localPlayer)?.Position;

  return position
    ? player.DistanceFromCharacter(position) <= config.Settings.MinimumDistance
    : false;
}

function isWhitelisted(player: Player) {
  const whitelist = config.Script.Whitelist;
  return whitelist.isEmpty() || whitelist.includes(player.Name);
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

export function getPlayerRootPart(player: Player) {
  return getPlayerHumanoid(player)?.RootPart;
}

export function lookAtPlayer(player: Player, wait: boolean) {
  const localPlayerRootPart = getPlayerRootPart(localPlayer);
  const playerRootPart = getPlayerRootPart(player);

  if (!(localPlayerRootPart && playerRootPart)) {
    return;
  }

  const targetPosition = new Vector3(
    playerRootPart.Position.X,
    localPlayerRootPart.Position.Y,
    playerRootPart.Position.Z,
  );

  const tweenInfo = new TweenInfo(
    config.Settings.LookSpeed || 0.25,
    Enum.EasingStyle.Sine,
    Enum.EasingDirection.InOut,
  );

  const tween = tweenService.Create(localPlayerRootPart, tweenInfo, {
    CFrame: CFrame.lookAt(localPlayerRootPart.Position, targetPosition),
  });

  tween.Play();
  if (wait) tween.Completed.Wait();
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

  try {
    const { Success, Body } = request
      ? request(args)
      : httpService.RequestAsync(args);

    return { Success, Body };
  } catch {
    log("error", "Request", "Failed to create request.");
  }
}

export function getCustomService<T>(className: string) {
  return game.GetService(className as keyof Services) as T;
}
