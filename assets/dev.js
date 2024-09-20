const fs = require("fs");
const build = require("./build");

let lock = false;

function watchFolder(folder) {
  fs.watch(folder, async function (_, file) {
    if (!lock && file) {
      lock = true;
      await build();

      setTimeout(function () {
        lock = false;
      }, 100);
    }
  });
}

const config = {
  folder: "src",
};

watchFolder(config.folder);
