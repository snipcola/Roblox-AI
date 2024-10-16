import defaultConfig from "config";
import store from "classes/store";

export enum Store {
  Instance = "Instance",
  AIMessage = "AI.Message",
  AIMessages = "AI.Messages",
  Messages = "Messages",
  PlayersWalking = "Players.Walking",
  AntiAFK = "AntiAFK",
  Config = "Config",
}

interface Script {
  Name: string;
  Whitelist: Array<string>;
  Blacklist: Array<string>;
  Debug: boolean;
}

interface Settings {
  AntiAFK: boolean;
  MinimumDistance?: number;
  MessageProcessDelay?: number;
  LookSpeed?: number;
}

interface AI {
  Prompt: string;
  Model: string;
  EnabledFunctions: Array<string>;
  MaximumCharacterLimit?: number;
  MaximumMessageContext?: number;
  Api: string;
  Key: string;
}

export interface Config {
  Script: Script;
  Settings: Settings;
  AI: AI;
}

export default store.get<Config>(Store.Config, defaultConfig, false);
