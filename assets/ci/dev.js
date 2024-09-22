const { watch } = require("chokidar");
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

const config = {
  folder: "src",
};

watchFolder(config.folder);
