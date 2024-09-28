import { Script, Settings, AI } from ".config.json";
import store from "store";

interface Script {
  Name: string;
  Whitelist: string[];
  Blacklist: string[];
  Debug: boolean;
}

interface Settings {
  AntiAFK: boolean;
  MinimumDistance: number | null;
  MessageProcessDelay: number | null;
}

interface AI {
  Prompt: string;
  Model: string;
  EnabledFunctions: string[];
  MaximumCharacterLimit: number | null;
  MaximumMessageContext: number | null;
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
