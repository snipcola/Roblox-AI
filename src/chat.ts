import store from "store";
import log from "log";

const players = game.GetService("Players");
const textChatService = game.GetService("TextChatService");
const replicatedStorage = game.GetService("ReplicatedStorage");

let connection: RBXScriptConnection | undefined = store.get("Chat");

function disconnectEvent() {
  if (connection?.Connected) {
    connection.Disconnect();
    log("debug", "Chat", "Disconnected");
  }

  connection = undefined;
  store.set("Chat", connection);
}

interface LegacyMessage {
  Message: string;
  FromSpeaker: string;
  MessageType: string;
}

type ChatCallback = (
  message: string,
  speaker: Player,
  whisper?: Whisper,
) => void;

export type Whisper = TextChannel | Player | boolean;

function getWhisper(
  channel: TextChannel | LegacyMessage | undefined,
  player?: Player,
): Whisper {
  if (!channel) {
    return false;
  }

  if ("Name" in channel) {
    return (
      channel?.Name?.lower().split(":").shift() === "rbxwhisper" && channel
    );
  }

  return (
    channel.MessageType.lower() === "whisper" &&
    typeIs(player, "Instance") &&
    player
  );
}

function connectEvent(callback: ChatCallback) {
  let connection;

  if (textChatService.ChatVersion === Enum.ChatVersion.TextChatService) {
    connection = textChatService.MessageReceived.Connect(function (message) {
      const text = message.Text;
      const player =
        message.TextSource?.UserId &&
        players.GetPlayerByUserId(message.TextSource.UserId);
      const whisper = getWhisper(message.TextChannel);

      if (text && player) {
        callback(text, player, whisper);
      }
    });
  } else {
    const onMessageDoneFiltering: Instance | undefined = replicatedStorage
      .FindFirstChild("DefaultChatSystemChatEvents")
      ?.FindFirstChild("OnMessageDoneFiltering");

    if (onMessageDoneFiltering?.IsA("RemoteEvent")) {
      connection = onMessageDoneFiltering.OnClientEvent.Connect(function (
        message: LegacyMessage,
      ) {
        const text: string = message.Message;
        const player = players
          .GetPlayers()
          .find((p) => p.Name === message.FromSpeaker);
        const whisper = getWhisper(message, player);

        if (text && player) {
          callback(text, player, whisper);
        }
      });
    }
  }

  if (connection) {
    store.set("Chat", connection);
    log("debug", "Chat", "Connected");
  } else log("error", "Chat", "Failed to connect");
}

function onMessage(callback: ChatCallback) {
  disconnectEvent();
  connectEvent(callback);
}

function sendMessage(message: string, whisper?: Whisper) {
  if (textChatService.ChatVersion === Enum.ChatVersion.TextChatService) {
    const channel: Instance | TextChannel | undefined =
      typeIs(whisper, "Instance") && whisper.IsA("TextChannel")
        ? whisper
        : textChatService
            .FindFirstChild("TextChannels")
            ?.FindFirstChild("RBXGeneral");

    if (channel?.IsA("TextChannel")) {
      channel.SendAsync(message);
    }
  } else {
    const sayMessageRequest: Instance | undefined = replicatedStorage
      .FindFirstChild("DefaultChatSystemChatEvents")
      ?.FindFirstChild("SayMessageRequest");

    if (sayMessageRequest?.IsA("RemoteEvent")) {
      sayMessageRequest.FireServer(
        typeIs(whisper, "Instance") && whisper.IsA("Player")
          ? `/whisper ${whisper?.Name} ${message}`
          : message,
        "All",
      );
    }
  }
}

export default {
  onMessage,
  sendMessage,
};
