const fs = require("fs");
const process = require("process");

const { measure } = require("./shared/functions");

function clean(folders) {
  for (const folder of folders) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
}

const config = {
  clean: [
    "out",
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
    console.error("Failed to clean");
    process.exit(1);
  }
}

console.log("Cleaning...");
console.log(`Cleaned (took ${measure(main)}ms)`);
