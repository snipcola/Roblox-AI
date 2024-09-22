## Roblox-AI

Become an AI on Roblox.

## Prerequisites

Make sure the following are installed:

- [node](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation) (optional)

It's recommended you also install the following VSCode extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Roblox-TS](https://marketplace.visualstudio.com/items?itemName=roblox-ts.vscode-roblox-ts)

## Instructions

If you installed `pnpm`, use that instead of `npm` for the following steps.

1. **Download / Clone**

   Download the project as a zip, or clone it with [Git](https://git-scm.com/downloads) like so:
   ```
   git clone [git_url]
   ```


2. **Develop**

   Open the folder in an IDE, preferably [VSCode](https://code.visualstudio.com), and run ``(p)npm install`` - you only have to do this once, unless you install more packages.<br/><br/>

   In the VSCode Terminal, you can execute `npm run dev / pnpm dev`. Now you can edit files in `src`, and it will compile to `out` when you save.

3. **Build**

   If you'd like to manually start the build process, instead of running the dev script, run `npm run build / pnpm build` which will build once.