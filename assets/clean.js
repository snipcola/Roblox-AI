const fs = require("fs");

function clean(folders) {
  for (const folder of folders) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
}

const config = {
  clean: [
    "dist",
    "include",
    "script.lua",
    "node_modules",
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
    ".DS_Store",
  ],
};

async function main() {
  const { default: yocto } = await import("yocto-spinner");
  const spinner = yocto({ text: "Cleaning", color: "green" }).start();

  try {
    clean(config.clean);
  } catch {
    return spinner.error("Failed to clean");
  }

  spinner.success("Cleaned");
}

main();
