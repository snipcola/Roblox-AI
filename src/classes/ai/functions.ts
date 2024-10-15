import { Message, Messages } from "classes/messages";
import config, { Store } from "lib/config";
import players from "classes/players";
import store from "classes/store";

const localPlayer = players.localPlayer();

export type ToolType = "function";

interface Function {
  name: string;
  description?: string;
  strict?: boolean;
  parameters?: object;
}

export interface Tool {
  type: ToolType;
  function: Function;
}

export interface AvailableFunction {
  tool: Tool;
  callback: (args?: object, messages?: Messages, message?: Message) => void;
}

export type AvailableFunctions = Array<AvailableFunction>;

export function aiSendMessage(
  messages: Messages | undefined,
  message: Message | undefined,
  content: string,
) {
  if (!(messages && message)) {
    return;
  }

  store.set<Message>(Store.AIMessage, message);
  messages.sendLocal(message, content);
}

const functions: AvailableFunctions = [
  {
    tool: {
      type: "function",
      function: {
        name: "sendMessage",
        description:
          "Sends a message into the Roblox chat. Use this in conjunction with other functions, to provide the user confirmation.",
        parameters: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to send.",
            },
            amount: {
              type: "number",
              description:
                "Amount of times to send the message. Set to 1 by default.",
            },
            interval: {
              type: "number",
              description:
                "Amount of seconds in-between sending the messages. Set to 0 by default, and 0.25 by default if amount more than 1.",
            },
          },
          required: ["message", "amount", "interval"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: (
      {
        message,
        amount = 1,
        interval = 0,
      }: {
        message: string;
        amount: number;
        interval: number;
      },
      chatMessages?: Messages,
      chatMessage?: Message,
    ) => {
      for (let i = 0; i < amount; i++) {
        aiSendMessage(chatMessages, chatMessage, message);
        task.wait(interval);
      }
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "lookAtPlayer",
        description:
          "Looks at a player. Never use this, unless the user explicitly asks for it.",
        parameters: {
          type: "object",
          properties: {
            player: {
              type: "string",
              description: "The name of the player to look at.",
            },
          },
          required: ["player"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: ({ player: name }: { player: string }) => {
      players.fromPartial(name)?.lookAt();
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "teleportToPlayer",
        description:
          "Teleports to a player, instantly. Only use when user explicitly mentions word 'teleport'.",
        parameters: {
          type: "object",
          properties: {
            player: {
              type: "string",
              description: "The name of the player to teleport to.",
            },
          },
          required: ["player"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: ({ player: name }: { player: string }) => {
      players.fromPartial(name)?.teleportTo();
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "walkToPlayer",
        description: "Walks to a player.",
        parameters: {
          type: "object",
          properties: {
            player: {
              type: "string",
              description: "The name of the player to walk to.",
            },
          },
          required: ["player"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: ({ player: name }: { player: string }) => {
      const player = players.fromPartial(name);
      if (player) players.walkTo(player);
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "followPlayer",
        description: "Follow a player indefinitely.",
        parameters: {
          type: "object",
          properties: {
            player: {
              type: "string",
              description: "The name of the player to follow.",
            },
          },
          required: ["player"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: ({ player: name }: { player: string }) => {
      const player = players.fromPartial(name);
      if (player) players.walkTo(player, true);
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "stopWalkingToPlayer",
        description:
          "Stops walking to, or following, a player - also known as 'unfollowing'.",
      },
    },
    callback: () => {
      players.stopWalking();
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "jump",
        description: "Perform a jump.",
        parameters: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              description: "Amount of times to jump. Set to 1 by default.",
            },
            interval: {
              type: "number",
              description:
                "Amount of seconds in-between jumping. Set to 0 by default, and 1 by default if amount more than 1.",
            },
          },
          required: ["amount", "interval"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: ({
      amount = 1,
      interval = 0,
    }: {
      amount: number;
      interval: number;
    }) => {
      for (let i = 0; i < amount; i++) {
        if (localPlayer.jump()) task.wait(interval);
      }
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "setWalkSpeed",
        description:
          "Sets your own walking speed. Be careful, don't set it too high, e.g. over 100.",
        parameters: {
          type: "object",
          properties: {
            speed: {
              type: "number",
              description: "The new walk speed. Set to 16 by default.",
            },
          },
          required: ["speed"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: ({ speed = 16 }: { speed: number }) => {
      localPlayer.setWalk(speed);
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "setJumpPower",
        description:
          "Sets your own jumping power. Be careful, don't set it too high, e.g. over 100.",
        parameters: {
          type: "object",
          properties: {
            power: {
              type: "number",
              description: "The new jump power. Set to 50 by default.",
            },
          },
          required: ["power"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: ({ power = 50 }: { power: number }) => {
      localPlayer.setJump(power);
    },
  },
].filter((t) =>
  config.AI.EnabledFunctions.includes(t.tool.function.name),
) as AvailableFunctions;

export default functions;
