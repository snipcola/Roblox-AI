import logger, { LogType } from "classes/logger";
import { waitForGameLoad } from "lib/functions";
import _messages, { Message } from "classes/messages";
import config, { Store } from "lib/config";
import AI from "classes/ai";
import antiafk from "classes/antiafk";
import store from "classes/store";

logger.log(LogType.Debug, "Script", "Started execution");

waitForGameLoad();
antiafk();

let locked = false;
const ai = new AI();

const messages = _messages(function (chatMessage: Message) {
  const { message, sender } = chatMessage;

  if (!(messages && sender)) {
    return;
  }

  if (sender?.local) {
    const aiMessage = store.get<Message>(Store.AIMessage);

    if (aiMessage && chatMessage.tagged()) {
      messages.sendLocal(
        aiMessage,
        "⛔ Sorry, my message was tagged. Try again or re-phrase your message.",
      );
    }

    store.set(Store.AIMessage);
    return;
  }

  if (locked || !sender.allowed() || chatMessage.tagged()) {
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

  logger.log(LogType.Debug, "Message", `${sender.name}: "${message}"`);
  ai.createChatCompletion(messages, chatMessage);
});

logger.log(LogType.Debug, "Script", "Completed execution");
