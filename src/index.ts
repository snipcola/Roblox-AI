import log from "log";
import {
  waitForGameLoad,
  isLocalPlayer,
  isPlayerAllowed,
  isTagged,
} from "functions";
import chat from "chat";
import config from "config";
import ai from "ai";
import antiafk from "antiafk";
import store from "store";

log("debug", "Script", "Started execution");

waitForGameLoad();
antiafk.initialize();

let locked = false;

chat.onMessage(function (message, speaker) {
  if (isLocalPlayer(speaker)) {
    if (store.get<boolean>("AIMessageSent") && isTagged(message)) {
      chat.sendMessage(
        "⛔ Sorry, my message was tagged. Try again or re-phrase your message.",
      );
    }

    store.set("AIMessageSent", false);
    return;
  }

  if (locked || !isPlayerAllowed(speaker) || isTagged(message)) {
    return;
  }

  const messageProcessDelay = config.Settings.MessageProcessDelay;

  if (messageProcessDelay) {
    task.spawn(function () {
      locked = true;
      task.wait(messageProcessDelay);
      locked = false;
    });
  }

  log("debug", "Message", `${speaker.Name}: "${message}"`);
  ai.createChatCompletion(message, speaker);
});

log("debug", "Script", "Completed execution");
