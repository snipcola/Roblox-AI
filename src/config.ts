import { Config } from "lib/config";

export default {
  Script: {
    Name: "RobloxAI",
    Whitelist: [],
    Blacklist: [],
    Debug: false,
  },
  Settings: {
    AntiAFK: true,
    MinimumDistance: 8,
    MessageProcessDelay: 1,
    LookSpeed: 0.25,
  },
  AI: {
    Prompt: "",
    Model: "gpt-4o-mini",
    EnabledFunctions: [
      "sendMessage",
      "lookAtPlayer",
      "teleportToPlayer",
      "walkToPlayer",
      "followPlayer",
      "stopWalkingToPlayer",
      "jump",
      "setWalkSpeed",
      "setJumpPower",
    ],
    MaximumCharacterLimit: 200,
    MaximumMessageContext: 5,
    Api: "https://api.openai.com/v1/chat/completions",
    Key: "OPENAI_API_KEY",
  },
} as Config;
