import players, { ExtendedPlayer } from "classes/players";
import { Store } from "lib/config";
import { Connection } from "classes/connection";

const textChatService = game.GetService("TextChatService");
const replicatedStorage = game.GetService("ReplicatedStorage");
const localPlayer = players.localPlayer();

export interface LegacyMessage {
  Message: string;
  FromSpeaker: string;
  MessageType: string;
}

type AnyMessage = TextChatMessage | LegacyMessage | string;
type SendEvent = TextChannel | RemoteEvent;

function getNew(): boolean {
  return textChatService.ChatVersion === Enum.ChatVersion.TextChatService;
}

function getSendEvent(): SendEvent | undefined {
  if (getNew()) {
    const RBXGeneral = textChatService
      .FindFirstChild("TextChannels")
      ?.FindFirstChild("RBXGeneral");

    if (RBXGeneral?.IsA("TextChannel")) {
      return RBXGeneral;
    }
  }

  const sayMessageRequest: Instance | undefined = replicatedStorage
    .FindFirstChild("DefaultChatSystemChatEvents")
    ?.FindFirstChild("SayMessageRequest");

  if (sayMessageRequest?.IsA("RemoteEvent")) {
    return sayMessageRequest;
  }
}

function send({ message }: { message: string }): void {
  const event = getSendEvent();

  if (event?.IsA("TextChannel")) {
    event.SendAsync(message);
  } else if (event?.IsA("RemoteEvent")) {
    event.FireServer(message, "All");
  }
}

export class Message {
  message: string;
  sender?: ExtendedPlayer;
  channel?: TextChannel;
  whisper?: boolean;

  private getSender(id?: number): ExtendedPlayer | undefined {
    return (id && players.fromID(id)) || undefined;
  }

  private getWhisper(input: TextChannel | LegacyMessage | undefined): boolean {
    if (!input) {
      return false;
    }

    return "Name" in input
      ? input?.Name?.lower().split(":").shift() === "rbxwhisper"
      : input.MessageType.lower() === "whisper";
  }

  constructor(
    message: AnyMessage,
    sender?: ExtendedPlayer,
    whisper?: boolean,
    channel?: TextChannel,
  ) {
    if (typeIs(message, "string")) {
      this.message = message;
      this.sender = sender;
      this.whisper = whisper;
      this.channel = channel;
    } else if ("Name" in message) {
      this.message = message.Text;
      this.sender = this.getSender(message.TextSource?.UserId);
      this.channel = message.TextChannel;
      this.whisper = this.getWhisper(this.channel);
    } else {
      this.message = message.Message;
      this.sender = players.fromName(message.FromSpeaker);
      this.whisper = this.getWhisper(message);
    }
  }

  tagged = () => !this.message.match("^#+$")?.isEmpty();

  respond({ message, sender }: Message, originalSender?: ExtendedPlayer) {
    const _sender = originalSender || sender;

    if (this.channel) {
      this.channel.SendAsync(message);
    } else if (_sender && !getNew()) {
      send({ message: `/whisper ${_sender.name} ${message}` });
    }
  }
}

type MessageCallback = (message: Message) => void;

export class Messages extends Connection {
  send(message: Message, originalSender?: ExtendedPlayer) {
    if (typeIs(message, "string")) send({ message });
    else if (message.whisper) message.respond(message, originalSender);
    else send(message);
  }

  sendLocal({ whisper, channel, sender }: Message, message: string) {
    this.send(new Message(message, localPlayer, whisper, channel), sender);
  }
}

function getEvent(): RBXScriptSignal | undefined {
  if (getNew()) {
    return textChatService.MessageReceived;
  }

  const onMessageDoneFiltering: Instance | undefined = replicatedStorage
    .FindFirstChild("DefaultChatSystemChatEvents")
    ?.FindFirstChild("OnMessageDoneFiltering");

  if (onMessageDoneFiltering?.IsA("RemoteEvent")) {
    return onMessageDoneFiltering.OnClientEvent;
  }
}

export default function (_callback: MessageCallback) {
  const event = getEvent();
  const callback = function (message: AnyMessage) {
    return _callback(new Message(message));
  };

  return (
    event &&
    new Messages({
      key: Store.Messages,
      signal: event,
      callback,
    })
  );
}
