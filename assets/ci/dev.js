const os = require("os");
const path = require("path");

const { watch } = require("chokidar");
const { executeCommand, error, hasArgs } = require("./shared/functions");

const { lookpath } = require("lookpath");
const build = require("./build");

let lock = false;

const _package = hasArgs("--package", "-p");
const sync = !_package && hasArgs("--sync", "-s");

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

      await build(true, sync, _package);
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
    error(true, "'rojo' not found.");
  }

  await executeCommand(rojo, ["plugin", "install"]);
  await executeCommand(rojo, ["serve", rojoConfig]);
}

async function main() {
  const root = path.resolve(__dirname, "..", "..");
  const config = {
    folder: path.resolve(root, "src"),
    rojoConfig: path.resolve(root, "assets", "rojo", "studio"),
  };

  await build(true, sync, _package);
  watchFolder(config.folder);
  if (sync) syncRojo(config.rojoConfig);
}

main();
