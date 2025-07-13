## Roblox-AI

Automates your Roblox character, enabling communication with others and custom functions.<br/>
**Note:** This project was created with [Create-Roblox-TS-Script](https://code.snipcola.com/snipcola/Create-Roblox-TS-Script) - refer there for compilation.

## Script

```lua
getgenv()["RobloxAI.Config"] = {
  Script = {
    Name = "RobloxAI",
    Whitelist = {},
    Blacklist = {},
    Debug = false
  },
  Settings = {
    AntiAFK = true,
    MinimumDistance = 8,
    MessageProcessDelay = 1,
    LookSpeed = 0.25
  },
  AI = {
    Prompt = "",
    Model = "gpt-4o-mini",
    EnabledFunctions = {
      "sendMessage",
      "lookAtPlayer",
      "teleportToPlayer",
      "walkToPlayer",
      "followPlayer",
      "stopWalkingToPlayer",
      "jump",
      "setWalkSpeed",
      "setJumpPower"
    },
    MaximumCharacterLimit = 200,
    MaximumMessageContext = 5,
    Api = "https://api.openai.com/v1/chat/completions",
    Key = "" -- Replace with your OpenAI API key.
  }
}

loadstring(game:HttpGetAsync("https://code.snipcola.com/snipcola/Roblox-AI/releases/download/latest/script.min.luau"))()
```
