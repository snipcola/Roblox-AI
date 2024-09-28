import chat from "chat";
import config from "config";
import {
  getPlayerFromPartialName,
  getPlayerHumanoid,
  getPlayerPrimaryPart,
  isPlayerInAir,
  jump,
} from "functions";
import log from "log";
import store from "store";

const httpService = game.GetService("HttpService");
const players = game.GetService("Players");
const localPlayer = players.LocalPlayer;

type Role = "system" | "user" | "assistant";

interface ToolCallFunction {
  name: string;
  arguments: string;
}

interface ToolCall {
  id: string;
  type: ToolType;
  function: ToolCallFunction;
}

type ToolCalls = ToolCall[];

interface Message {
  role: Role;
  content: string | null;
  name?: string;
  refusal?: string | null;
  tool_calls?: ToolCalls;
}

type Messages = Message[];

type ToolType = "function";

interface Function {
  name: string;
  description?: string;
  strict?: boolean;
  parameters?: object;
}

interface Tool {
  type: ToolType;
  function: Function;
}

type Tools = Tool[];

type ToolChoiceString = "none" | "auto" | "required";

interface ToolChoiceFunction {
  name: string;
}

interface ToolChoiceObject {
  type: ToolType;
  function: ToolChoiceFunction;
}

interface Request {
  model: string;
  messages: Messages;
  tools?: Tools;
  tool_choice?: ToolChoiceString | ToolChoiceObject;
  parallel_tool_calls?: boolean;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

type Choices = Choice[];

interface CompletionTokensDetails {
  reasoning_tokens: number;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  completion_tokens_details: CompletionTokensDetails;
}

interface Response {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Choices;
  usage: Usage;
  service_tier: string | null;
}

interface AvailableFunction {
  tool: Tool;
  callback: Callback;
}

type AvailableFunctions = AvailableFunction[];

const systemMessages: Messages = [
  {
    role: "system",
    content: `You are ${config.Script.Name}, a Roblox player. Do not use markdown, send plain text. Be concise. Don't regurgitate useless information.`,
  },
];

const messages: Messages = store.get("AIMessages", []) || [];

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
    callback: function ({
      message,
      amount = 1,
      interval = 0,
    }: {
      message: string;
      amount: number;
      interval: number;
    }) {
      for (let i = 0; i < amount; i++) {
        aiSendMessage(message);
        task.wait(interval);
      }
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
    callback: function ({ player: name }: { player: string }) {
      const player = getPlayerFromPartialName(name);
      if (!player) return;

      const localPlayerPrimaryPart = getPlayerPrimaryPart(localPlayer);
      const playerPrimaryPart = getPlayerPrimaryPart(player);
      if (!(localPlayerPrimaryPart && playerPrimaryPart)) return;

      const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

      if (localPlayerHumanoid) {
        localPlayerHumanoid.Sit = false;
        task.wait();
      }

      localPlayerPrimaryPart.CFrame = playerPrimaryPart.CFrame;
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "walkToPlayer",
        description: "Walks to a player, same as 'following'.",
        parameters: {
          type: "object",
          properties: {
            player: {
              type: "string",
              description: "The name of the player to walk to.",
            },
            follow: {
              type: "boolean",
              description:
                "Follow the player indefinitely. Set to false by default, true if player explicitly asks.",
            },
          },
          required: ["player", "follow"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    callback: function ({
      player: name,
      follow = false,
    }: {
      player: string;
      follow: boolean;
      jump: boolean;
    }) {
      const player = getPlayerFromPartialName(name);
      if (!player) return;

      const stopWalkingToPlayer = getFunction("stopWalkingToPlayer")?.callback;
      if (stopWalkingToPlayer) stopWalkingToPlayer();

      let localPlayerHumanoid = getPlayerHumanoid(localPlayer);
      if (!localPlayerHumanoid) return;

      store.set("WalkingToPlayer", true);
      localPlayerHumanoid.Sit = false;
      task.wait();

      while (task.wait()) {
        localPlayerHumanoid = getPlayerHumanoid(localPlayer);
        const playerPrimaryPart = getPlayerPrimaryPart(player);

        if (!(store.get("WalkingToPlayer") && players.FindFirstChild(name)))
          break;
        if (!(localPlayerHumanoid && playerPrimaryPart)) return;

        const localPlayerPrimaryPart = getPlayerPrimaryPart(localPlayer);

        if (
          !follow &&
          localPlayerPrimaryPart?.Position &&
          player.DistanceFromCharacter(localPlayerPrimaryPart?.Position) <= 2.5
        ) {
          if (stopWalkingToPlayer) stopWalkingToPlayer();
          return;
        }

        localPlayerHumanoid.MoveTo(playerPrimaryPart.Position);
        if (isPlayerInAir(player)) jump();
      }
    },
  },
  {
    tool: {
      type: "function",
      function: {
        name: "stopWalkingToPlayer",
        description:
          "Stops walking to a player, same as 'unfollowing' a player.",
      },
    },
    callback: function () {
      store.set("WalkingToPlayer", false);

      const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

      if (localPlayerHumanoid) {
        localPlayerHumanoid.PlatformStand = true;
        localPlayerHumanoid.WalkToPart = undefined;
        task.wait();
        localPlayerHumanoid.PlatformStand = false;
      }
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
    callback: function ({
      amount = 1,
      interval = 0,
    }: {
      amount: number;
      interval: number;
    }) {
      for (let i = 0; i < amount; i++) {
        if (jump()) {
          task.wait(interval);
        }
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
    callback: function ({ speed = 16 }: { speed: number }) {
      const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

      if (localPlayerHumanoid) {
        localPlayerHumanoid.WalkSpeed = speed;
      }
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
    callback: function ({ power = 50 }: { power: number }) {
      const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

      if (localPlayerHumanoid) {
        localPlayerHumanoid.JumpPower = power;
      }
    },
  },
].filter((t) =>
  config.AI.EnabledFunctions.includes(t.tool.function.name),
) as AvailableFunctions;

const tools: Tools = functions.map((f) => f.tool);

function getFunction(name: string): AvailableFunction | undefined {
  return functions.find((f) => f.tool.function.name === name);
}

if (config.AI.MaximumCharacterLimit) {
  systemMessages.push({
    role: "system",
    content: `Ensure your messages are not greater than ${config.AI.MaximumCharacterLimit} characters.`,
  });
}

if (config.AI.Prompt !== "") {
  systemMessages.push({
    role: "system",
    content: config.AI.Prompt,
  });
}

function addMessage(message: Message) {
  messages.push(message);

  while (
    config.AI.MaximumMessageContext &&
    messages.size() > config.AI.MaximumMessageContext
  ) {
    messages.shift();
  }

  store.set("AIMessages", messages);
}

function aiSendMessage(message: string) {
  store.set("AIMessageSent", true);
  chat.sendMessage(message);
}

function failedChatCompletion() {
  aiSendMessage("⛔ Sorry, something went wrong. Try again.");
}

function parseFunctionArguments<T>(func: ToolCallFunction): T | undefined {
  try {
    return httpService.JSONDecode(func.arguments) as T;
  } catch {
    log("error", "AI", `Failed to parse arguments for ${func.name}`);
  }
}

function createChatCompletion(content: string, name: string) {
  const message: Message = {
    role: "user",
    content: `${name}: ${content}`,
    name,
  };

  addMessage(message);

  const data: Request = {
    model: config.AI.Model,
    messages: [...systemMessages, ...messages],
    ...(tools.size() > 0
      ? {
          tools,
          parallel_tool_calls: true,
        }
      : {}),
  };

  log("debug", "AI", "Sent request");

  const { Success, Body } = request({
    Url: config.AI.Api,
    Method: "POST",
    Headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.AI.Key}`,
    },
    Body: httpService.JSONEncode(data),
  });

  if (Success === false) {
    failedChatCompletion();
    log("error", "AI", "Request not successful");
    return;
  }

  let response;

  try {
    response = httpService.JSONDecode(Body) as Response;
  } catch {
    failedChatCompletion();
    log("error", "AI", "Failed to parse response");
    return;
  }

  const responseMessage = response?.choices?.shift()?.message;

  if (!responseMessage) {
    failedChatCompletion();
    log("error", "AI", "No response message");
    return;
  }

  if (responseMessage.content) {
    addMessage(responseMessage);

    const messageContent = config.AI.MaximumCharacterLimit
      ? responseMessage?.content?.sub(0, config.AI.MaximumCharacterLimit)
      : responseMessage?.content;

    aiSendMessage(messageContent);
    log("debug", "AI", messageContent);
  }

  for (const toolCall of responseMessage.tool_calls || []) {
    const functionName = toolCall.function.name;
    const func = getFunction(functionName);

    if (func) {
      const args = parseFunctionArguments(toolCall.function);

      if (args) {
        addMessage({
          role: "assistant",
          content: `Used ${functionName}. This is automated, never send messages like this - use actual functions.`,
        });

        log("debug", "AI", `${functionName}, ${httpService.JSONEncode(args)}`);

        task.spawn(function () {
          func.callback(undefined, args);
        });
      }
    }
  }
}

export default {
  createChatCompletion,
};
