## Roblox-AI

Become an AI on Roblox.

## Script

If you don't want to compile it, you can use the latest release via loadstring - don't forget to add your API key.

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
    MinimumDistance = 5,
    MessageProcessDelay = 1
  },
  AI = {
    Prompt = "",
    Model = "gpt-4o-mini",
    EnabledFunctions = {
      "sendMessage",
      "teleportToPlayer",
      "walkToPlayer",
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

loadstring(game:HttpGetAsync("https://github.com/snipcola/Roblox-AI/releases/latest/download/script.min.lua"))()
```

## Compilation

### Prerequisites

Make sure the following are installed:

- [node](https://nodejs.org/en/download)
- [aftman](https://github.com/LPGhatguy/aftman/releases/latest)
- [pnpm](https://pnpm.io/installation#using-a-standalone-script) (optional)

### Instructions

If you installed `pnpm`, use that instead of `npm` for the following steps.

1. **Download / Clone**

   Download the project as a zip, or clone it with [Git](https://git-scm.com/downloads) like so:

   ```
   git clone [git_url]
   ```

2. **Install Dependencies**

   Open the folder in an IDE, preferably [VSCode](https://code.visualstudio.com), and run `(p)npm install` - you only have to do this once, unless you install more packages.

3. **Develop**

   In the VSCode Terminal, you can execute `npm run dev / pnpm dev`. Now you can edit files in `src`, and it will compile to `out` when you save.

4. **Build**

   If you'd like to manually start the build process, instead of running the dev script, run `npm run build / pnpm build` which will build once.
