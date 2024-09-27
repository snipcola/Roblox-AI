const os = require("os");
const fs = require("fs");

const path = require("path");
const process = require("process");

const { spawnSync } = require("child_process");
const { lookpath } = require("lookpath");

const build = require("roblox-ts/out/CLI/commands/build");
const { measure } = require("../shared/functions");
const bundler = require("./bundler");

function clean(folders) {
  for (const folder of folders) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
}

function executeCommand(command, args, cwd) {
  const useCMD =
    process.platform === "win32" && !command?.toLowerCase()?.endsWith(".exe");
  const result = spawnSync(
    useCMD ? "cmd.exe" : command,
    useCMD ? ["/c", command, ...args] : args,
    {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  return {
    success: result.error === undefined,
    output: result.stdout.toString(),
    error: result.stderr.toString(),
  };
}

async function getDarklua() {
  const directory = path.resolve(os.homedir(), ".aftman", "bin");
  return await lookpath("darklua", { include: [directory] });
}

function minifyFile(darklua, file) {
  const { success } = executeCommand(darklua, [
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

function cleanFile(path) {
  fs.writeFileSync(
    path,
    fs
      .readFileSync(path, "utf8")
      .replace(/(\r\n|\n|\r)/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    "utf8",
  );
}

const root = path.resolve(__dirname, "..", "..", "..");
const outFolder = path.resolve(root, "out");
const assetsFolder = path.resolve(root, "assets");

const config = {
  root,
  folder: outFolder,
  clean: [outFolder],
  input: path.resolve(outFolder, "init.luau"),
  output: path.resolve(outFolder, "script.lua"),
  outputMin: path.resolve(outFolder, "script.min.lua"),
  rojoConfig: path.resolve(assetsFolder, "rojo.json"),
  include: path.resolve(outFolder, "include"),
  nodeModules: path.resolve(root, "node_modules"),
};

async function main() {
  const { default: yocto } = await import("yocto-spinner");
  const spinner = yocto({ text: "Building", color: "blue" }).start();
  const darklua = await getDarklua();

  function error(...args) {
    spinner.error(...args);
    clean(config.clean);
    process.exit(1);
  }

  if (!darklua) {
    error("Couldn't find 'darklua'");
  }

  const elapsed = measure(function () {
    try {
      clean(config.clean);
      build.handler({
        project: ".",
        rojo: config.rojoConfig,
        includePath: config.include,
      });
    } catch {
      error("Failed to build");
    }

    try {
      spinner.text = "Bundling";
      spinner.color = "yellow";
      bundler(config);
    } catch {
      error("Failed to bundle");
    }

    try {
      spinner.text = "Moving Files";
      spinner.color = "magenta";

      clean(config.clean);
      fs.mkdirSync(config.folder, { recursive: true });
      fs.renameSync(path.basename(config.output), config.output);
    } catch {
      error("Failed to move files");
    }

    try {
      spinner.text = "Minifying";
      spinner.color = "green";

      minifyFile(darklua, config.output);
      fs.cpSync(config.output, config.outputMin, { force: true });

      cleanFile(config.outputMin);
      minifyFile(darklua, config.outputMin);
    } catch {
      error("Failed to minify");
    }
  });

  spinner.success(`Built (took ${elapsed}ms)`);
}

main();
module.exports = main;
