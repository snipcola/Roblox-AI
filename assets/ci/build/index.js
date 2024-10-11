const os = require("os");
const fs = require("fs/promises");

const path = require("path");
const process = require("process");

const { lookpath } = require("lookpath");
const {
  executeCommand,
  measure,
  clean,
  hasArgs,
} = require("../shared/functions");

const build = require("roblox-ts/out/CLI/commands/build");
const bundler = require("./bundler");

async function getDarklua() {
  const directory = path.resolve(os.homedir(), ".aftman", "bin");
  return await lookpath("darklua", { include: [directory] });
}

async function minifyFile(darklua, file) {
  const { success } = await executeCommand(darklua, [
    "process",
    "--config",
    path.resolve(__dirname, "config", `${path.basename(file)}.json`),
    file,
    file,
  ]);

  if (!success) {
    throw Error;
  }
}

async function cleanFile(path) {
  const contents = await fs.readFile(path, "utf8");

  await fs.writeFile(
    path,
    contents
      .replace(/(\r\n|\n|\r)/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    "utf8",
  );
}

async function main(dev, sync, package) {
  package = package || hasArgs("--package", "-p");

  const root = path.resolve(__dirname, "..", "..", "..");
  const outFolder = path.resolve(root, "out");
  const assetsFolder = path.resolve(root, "assets");
  const rojoScript = path.resolve(
    assetsFolder,
    "rojo",
    "studio",
    "script.client.lua",
  );

  const config = {
    root,
    folder: outFolder,
    clean: [outFolder, ...(!sync ? [rojoScript] : [])],
    input: path.resolve(outFolder, "init.luau"),
    output: path.resolve(outFolder, "script.lua"),
    outputMin: path.resolve(outFolder, "script.min.lua"),
    outputRojo: rojoScript,
    rojoConfig: path.resolve(assetsFolder, "rojo", "default.project.json"),
    include: path.resolve(outFolder, "include"),
    nodeModules: path.resolve(root, "node_modules"),
  };

  const { default: yocto } = await import("yocto-spinner");
  const spinner = yocto({ text: "Building", color: "blue" }).start();
  const darklua = await getDarklua();

  async function error(...args) {
    spinner.error(...args);
    await clean([
      ...config.clean,
      path.resolve(root, path.basename(config.output)),
    ]);
    if (!dev) process.exit(1);
  }

  function changeSpinner(text, color) {
    if (text) spinner.text = text;
    if (color) spinner.color = color;
  }

  if (!darklua) {
    await error("Couldn't find 'darklua'");
    return;
  }

  const elapsed = await measure(async function () {
    try {
      await clean(config.clean);
      build.handler({
        project: ".",
        rojo: config.rojoConfig,
        ...(!package
          ? {
              includePath: config.include,
            }
          : {
              type: "package",
              noInclude: true,
            }),
      });
    } catch {
      await error("Failed to build");
      return;
    }

    if (!package) {
      try {
        changeSpinner("Bundling", "yellow");
        await bundler(config);
      } catch {
        await error("Failed to bundle");
        return;
      }

      try {
        changeSpinner("Moving Files", "magenta");
        await clean(config.clean);

        await fs.mkdir(config.folder, { recursive: true });
        await fs.rename(
          path.resolve(root, path.basename(config.output)),
          config.output,
        );
      } catch {
        await error("Failed to move files");
        return;
      }

      try {
        changeSpinner("Minifying", "green");

        await minifyFile(darklua, config.output);
        await fs.cp(config.output, config.outputMin, { force: true });

        if (sync) {
          await fs.cp(config.output, config.outputRojo, { force: true });
        }

        await cleanFile(config.outputMin);
        await minifyFile(darklua, config.outputMin);
      } catch {
        await error("Failed to minify");
        return;
      }
    }
  });

  spinner.success(`Built (took ${elapsed}ms)`);
}

if (require.main === module) main();
module.exports = main;
