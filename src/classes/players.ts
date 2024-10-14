import config, { Store } from "lib/config";
import { startsWith } from "lib/functions";
import store from "classes/store";

const tweenService = game.GetService("TweenService");
const players = game.GetService("Players");
const _localPlayer = players.LocalPlayer;

export class ExtendedPlayer {
  private player: Player;
  private whitelisted: boolean;

  id: number;
  name: string;
  displayName: string;
  local: boolean;

  private _whitelisted() {
    const whitelist = config.Script.Whitelist;
    return whitelist.isEmpty() || whitelist.includes(this.name);
  }

  private blacklisted() {
    return config.Script.Blacklist.includes(this.name);
  }

  private self() {
    return this.player === _localPlayer;
  }

  constructor(player: Player) {
    this.player = player;
    this.id = player.UserId;
    this.name = player.Name;
    this.displayName = player.DisplayName;
    this.whitelisted = this._whitelisted() && !this.blacklisted();
    this.local = this.self();
  }

  onIdled(callback: Callback): RBXScriptConnection {
    return this.player.Idled.Connect(callback);
  }

  humanoid = () => this.player.Character?.FindFirstChildOfClass("Humanoid");
  rootPart = () => this.humanoid()?.RootPart;
  inAir = () => this.humanoid()?.GetState() === Enum.HumanoidStateType.Freefall;

  matches(partial: string) {
    const name = this.name.lower();
    const displayName = this.displayName.lower();

    return (
      [name, displayName].includes(partial) ||
      startsWith(name, partial) ||
      startsWith(displayName, partial)
    );
  }

  private localPlayer() {
    return new ExtendedLocalPlayer(_localPlayer);
  }

  distanceFrom(position: Vector3) {
    return this.player.DistanceFromCharacter(position);
  }

  distance() {
    if (this.local) return;

    const rootPart = this.localPlayer().rootPart();
    if (rootPart) return this.distanceFrom(rootPart.Position);
  }

  private inDistance() {
    if (!(config.Settings.MinimumDistance && this.rootPart())) {
      return true;
    }

    const position = this.localPlayer().rootPart()?.Position;

    return position
      ? this.distanceFrom(position) <= config.Settings.MinimumDistance
      : false;
  }

  allowed = () => this.whitelisted && this.inDistance();

  teleportTo() {
    if (this.local) return;

    const localPlayer = this.localPlayer();
    const localRootPart = localPlayer.rootPart();
    const rootPart = this.rootPart();

    if (!(localRootPart && rootPart)) {
      return;
    }

    localPlayer.sit(false);
    task.wait();

    localRootPart.CFrame = rootPart.CFrame;
  }

  walkTo() {
    const localPlayer = this.localPlayer();
    const localHumanoid = localPlayer.humanoid();
    const rootPart = this.rootPart();

    if (!(localHumanoid && rootPart)) {
      return;
    }

    localPlayer.sit(false);
    task.wait();

    localHumanoid.MoveTo(rootPart.Position);
    if (this.inAir()) localPlayer.jump();
  }

  lookAt(wait?: boolean) {
    const localRootPart = this.localPlayer().rootPart();
    const rootPart = this.rootPart();

    if (!(localRootPart && rootPart)) {
      return;
    }

    const targetPosition = new Vector3(
      rootPart.Position.X,
      localRootPart.Position.Y,
      rootPart.Position.Z,
    );

    const tweenInfo = new TweenInfo(
      config.Settings.LookSpeed || 0.25,
      Enum.EasingStyle.Sine,
      Enum.EasingDirection.InOut,
    );

    const tween = tweenService.Create(localRootPart, tweenInfo, {
      CFrame: CFrame.lookAt(localRootPart.Position, targetPosition),
    });

    tween.Play();
    if (wait) tween.Completed.Wait();
  }
}

export class ExtendedLocalPlayer extends ExtendedPlayer {
  jump() {
    const humanoid = this.humanoid();

    if (humanoid && !this.inAir()) {
      humanoid.ChangeState(Enum.HumanoidStateType.Jumping);
      return true;
    }

    return false;
  }

  sit(toggle: boolean = true) {
    const humanoid = this.humanoid();
    if (humanoid) humanoid.Sit = toggle;
  }

  setWalk(speed: number) {
    const humanoid = this.humanoid();
    if (humanoid) humanoid.WalkSpeed = speed;
  }

  setJump(power: number) {
    const humanoid = this.humanoid();
    if (humanoid) humanoid.JumpPower = power;
  }
}

type PossiblyExtendedPlayer = ExtendedPlayer | undefined;

class ExtendedPlayers {
  get(): Array<ExtendedPlayer> {
    return players
      .GetPlayers()
      .map(
        (player) =>
          new (player === _localPlayer ? ExtendedLocalPlayer : ExtendedPlayer)(
            player,
          ),
      );
  }

  localPlayer(): ExtendedLocalPlayer {
    return new ExtendedLocalPlayer(_localPlayer);
  }

  has(player: ExtendedPlayer): boolean {
    return this.fromID(player.id) !== undefined;
  }

  fromID(id: number): PossiblyExtendedPlayer {
    return this.get().find((p) => p.id === id);
  }

  fromName(name: string): PossiblyExtendedPlayer {
    return this.get().find((p) => p.name === name);
  }

  fromPartial(partial: string): PossiblyExtendedPlayer {
    partial = partial.lower();

    return this.get()
      .filter((p) => !p.local)
      .find((p) => p.matches(partial));
  }

  walkTo(player: ExtendedPlayer, follow?: boolean) {
    if (player.local) return;

    this.stopWalking();
    store.set(Store.PlayersWalking, true);

    while (task.wait()) {
      if (!(store.get(Store.PlayersWalking) && this.has(player))) {
        break;
      }

      const distance = player.distance();
      const inRange = distance && distance <= 4;

      if (inRange) this.stopWalking(!follow);
      else player.walkTo();
    }
  }

  stopWalking(exit: boolean = true) {
    if (exit) store.set(Store.PlayersWalking, false);
    this.localPlayer().walkTo();
  }
}

export default new ExtendedPlayers();
