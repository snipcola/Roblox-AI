import chat from "chat";
import config from "config";
import {
  getPlayerFromPartialName,
  getPlayerHumanoid,
  getPlayerPrimaryPart,
  isPlayerInAir,
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

const systemMessages: Messages = [
  {
    role: "system",
    content: `You are ${config.Script.Name}, a Roblox player. Do not use markdown, send plain text. Be concise. Don't regurgitate useless information.`,
  },
];

const messages: Messages = store.get("AIMessages", []) || [];

const tools: Tools = [
  {
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
  {
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
  {
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
              "Follow the player indefinitely. Only enable if player explicitly asks.",
          },
        },
        required: ["player", "follow"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "stopWalkingToPlayer",
      description: "Stops walking to a player, same as 'unfollowing' a player.",
    },
  },
  {
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
  {
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
            description: "The new walk speed.",
          },
        },
        required: ["speed"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
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
            description: "The new jump power.",
          },
        },
        required: ["power"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
].filter((t) => config.AI.EnabledFunctions.includes(t.function.name)) as Tools;

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

interface AvailableFunction {
  name: string;
  callback: Callback;
}

type AvailableFunctions = AvailableFunction[];

function sendMessage({
  message,
  amount,
  interval,
}: {
  message: string;
  amount: number;
  interval: number;
}) {
  for (let i = 0; i < amount; i++) {
    aiSendMessage(message);
    task.wait(interval);
  }
}

function teleportToPlayer({ player: name }: { player: string }) {
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
}

function walkToPlayer({
  player: name,
  follow,
}: {
  player: string;
  follow: boolean;
  jump: boolean;
}) {
  const player = getPlayerFromPartialName(name);
  if (!player) return;

  if (store.get("WalkingToPlayer")) {
    stopWalkingToPlayer();
    task.wait();
  }

  let localPlayerHumanoid = getPlayerHumanoid(localPlayer);
  if (!localPlayerHumanoid) return;

  store.set("WalkingToPlayer", true);
  localPlayerHumanoid.Sit = false;
  task.wait();

  while (task.wait()) {
    localPlayerHumanoid = getPlayerHumanoid(localPlayer);
    const playerPrimaryPart = getPlayerPrimaryPart(player);

    if (!(store.get("WalkingToPlayer") && players.FindFirstChild(name))) break;
    if (!(localPlayerHumanoid && playerPrimaryPart)) return;

    const localPlayerPrimaryPart = getPlayerPrimaryPart(localPlayer);

    if (
      !follow &&
      localPlayerPrimaryPart?.Position &&
      player.DistanceFromCharacter(localPlayerPrimaryPart?.Position) <= 2.5
    ) {
      stopWalkingToPlayer();
      return;
    }

    localPlayerHumanoid.MoveTo(playerPrimaryPart.Position);
    if (isPlayerInAir(player)) jump({ amount: 1, interval: 0 });
  }
}

function stopWalkingToPlayer() {
  store.set("WalkingToPlayer", false);

  const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

  if (localPlayerHumanoid) {
    localPlayerHumanoid.PlatformStand = true;
    localPlayerHumanoid.WalkToPart = undefined;
    task.wait();
    localPlayerHumanoid.PlatformStand = false;
  }
}

function jump({ amount, interval }: { amount: number; interval: number }) {
  for (let i = 0; i < amount; i++) {
    const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

    if (!isPlayerInAir(localPlayer) && localPlayerHumanoid) {
      localPlayerHumanoid.ChangeState(Enum.HumanoidStateType.Jumping);
      task.wait(interval);
    }
  }
}

function setWalkSpeed({ speed }: { speed: number }) {
  const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

  if (localPlayerHumanoid) {
    localPlayerHumanoid.WalkSpeed = speed;
  }
}

function setJumpPower({ power }: { power: number }) {
  const localPlayerHumanoid = getPlayerHumanoid(localPlayer);

  if (localPlayerHumanoid) {
    localPlayerHumanoid.JumpPower = power;
  }
}

const availableFunctions: AvailableFunctions = [
  {
    name: "sendMessage",
    callback: sendMessage,
  },
  {
    name: "teleportToPlayer",
    callback: teleportToPlayer,
  },
  {
    name: "walkToPlayer",
    callback: walkToPlayer,
  },
  {
    name: "stopWalkingToPlayer",
    callback: stopWalkingToPlayer,
  },
  {
    name: "jump",
    callback: jump,
  },
  {
    name: "setWalkSpeed",
    callback: setWalkSpeed,
  },
  {
    name: "setJumpPower",
    callback: setJumpPower,
  },
].filter((f) => config.AI.EnabledFunctions.includes(f.name));

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
    const availableFunction = availableFunctions.find(
      (f) => f.name === toolCall.function.name,
    );

    if (availableFunction) {
      const args = parseFunctionArguments(toolCall.function);

      if (args) {
        addMessage({
          role: "assistant",
          content: `Used ${availableFunction.name}. This is automated, do not send messages like this - instead use actual functions.`,
        });

        log(
          "debug",
          "AI",
          `${availableFunction.name}, ${httpService.JSONEncode(args)}`,
        );

        task.spawn(function () {
          availableFunction.callback(args);
        });
      }
    }
  }
}

export default {
  createChatCompletion,
};
