const process = require("process");
const path = require("path");
const { measure, clean } = require("./shared/functions");

async function main() {
  const root = path.resolve(__dirname, "..", "..");
  const config = {
    clean: [
      path.resolve(root, "out"),
      path.resolve(root, "script.lua"),
      path.resolve(root, "assets", "rojo", "studio", "script.client.lua"),
      path.resolve(root, "node_modules"),
      path.resolve(root, "pnpm-lock.yaml"),
      path.resolve(root, "package-lock.json"),
      path.resolve(root, "yarn.lock"),
      path.resolve(root, ".DS_Store"),
    ],
  };

  try {
    await clean(config.clean);
  } catch {
    console.error("\u2716 Failed to clean");
    process.exit(1);
  }
}

async function measureMain() {
  console.log("- Cleaning");
  console.log(`\u2714 Cleaned (took ${await measure(main)}ms)`);
}

measureMain();
