import store from "store";
import log from "log";

type ChatCallback = (
  message: string,
  speaker: Player,
  recipient?: Player,
) => void;

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

function connectEvent(callback: ChatCallback) {
  let connection;

  if (textChatService.ChatVersion === Enum.ChatVersion.TextChatService) {
    connection = textChatService.MessageReceived.Connect(function (message) {
      const text = message.Text;
      const player =
        message.TextSource?.UserId &&
        players.GetPlayerByUserId(message.TextSource.UserId);

      if (text && player) callback(text, player);
    });
  } else {
    const onMessageDoneFiltering: Instance | undefined = replicatedStorage
      .FindFirstChild("DefaultChatSystemChatEvents")
      ?.FindFirstChild("OnMessageDoneFiltering");

    if (onMessageDoneFiltering?.IsA("RemoteEvent")) {
      connection = onMessageDoneFiltering.OnClientEvent.Connect(
        function (message: { Message: string; FromSpeaker: string }) {
          const text: string = message.Message;
          const player = players
            .GetPlayers()
            .find((p) => p.Name === message.FromSpeaker);

          if (text && player) {
            callback(text, player);
          }
        },
      );
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

function sendMessage(message: string) {
  if (textChatService.ChatVersion === Enum.ChatVersion.TextChatService) {
    const channel: Instance | undefined = textChatService
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
      sayMessageRequest.FireServer(message, "All");
    }
  }
}

export default {
  onMessage,
  sendMessage,
};
