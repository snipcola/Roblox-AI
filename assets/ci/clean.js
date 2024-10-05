const path = require("path");
const { measure, clean, info, success, error } = require("./shared/functions");

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
    error(true, "Failed to clean.");
  }
}

async function measureMain() {
  info("Cleaning.");
  success(`Cleaned (took ${await measure(main)}ms).`);
}

measureMain();
