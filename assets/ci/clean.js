const fs = require("fs");
const { measure } = require("./shared/functions");

function clean(folders) {
  for (const folder of folders) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
}

const config = {
  clean: [
    "out",
    "include",
    "script.lua",
    "node_modules",
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
    ".DS_Store",
  ],
};

function main() {
  try {
    clean(config.clean);
  } catch {
    return console.error("Failed to clean");
  }
}

console.log("Cleaning...");
console.log(`Cleaned (took ${measure(main)}ms)`);
