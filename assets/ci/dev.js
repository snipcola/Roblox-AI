const os = require("os");
const process = require("process");
const path = require("path");

const { watch } = require("chokidar");
const { executeCommand } = require("./shared/functions");

const { lookpath } = require("lookpath");
const build = require("./build");

let lock = false;

function watchFolder(folder) {
  const watcher = watch(folder, {
    usePolling: true,
    interval: 100,
    depth: 100,
  });

  watcher.once("ready", function () {
    watcher.on("all", async function (_, path) {
      if (lock || !path) return;
      lock = true;

      await build();
      lock = false;
    });
  });
}

async function getRojo() {
  const directory = path.resolve(os.homedir(), ".aftman", "bin");
  return await lookpath("rojo", { include: [directory] });
}

async function syncRojo(rojoConfig) {
  const rojo = await getRojo();

  if (!rojo) {
    console.error("\u2716 Rojo not found");
    process.exit(1);
  }

  await executeCommand(rojo, ["plugin", "install"]);
  await executeCommand(rojo, ["serve", rojoConfig]);
}

async function main(config) {
  await build();
  watchFolder(config.folder);

  const args = process.argv.splice(2);

  if (["--sync", "-s"].some((a) => args.includes(a))) {
    syncRojo(config.rojoConfig);
  }
}

const root = path.resolve(__dirname, "..", "..");

const config = {
  folder: path.resolve(root, "src"),
  rojoConfig: path.resolve(root, "assets", "rojo", "studio"),
};

main(config);
