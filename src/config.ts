import { Script, Settings, AI } from ".config.json";
import store from "store";

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

interface Config {
  Script: Script;
  Settings: Settings;
  AI: AI;
}

export default store.get<Config>(
  "Config",
  {
    Script,
    Settings,
    AI,
  },
  false,
);
