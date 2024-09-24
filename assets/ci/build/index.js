const fs = require("fs");
const path = require("path");
const process = require("process");

const build = require("roblox-ts/out/CLI/commands/build");
const { measure } = require("../shared/functions");

const bundler = require("./bundler");
const minifier = require("darklua-bin-wrapper");

function fetchFiles(contents, filePath, attemptedPaths) {
  if (attemptedPaths?.has(filePath)) return new Set();
  const fileName = path.basename(filePath);
  const isInit = ["init.luau", "init.lua"].includes(fileName);

  function scriptToPath(args) {
    const isScript = args[0] === "script";
    const pathList = isScript && !isInit ? [] : [".."];
    if (isScript) args.shift();

    for (const arg of args) {
      pathList.push(arg === "Parent" ? ".." : arg);
    }

    return pathList;
  }

  function toPath(args, forceArgs) {
    if (!args) return;
    const context = args.shift();

    return {
      path: path.resolve(
        filePath,
        [...scriptToPath(context.split(".")), ...args].join("/"),
      ),
      args: forceArgs || args,
    };
  }

  function getPath({ path: _path, args }) {
    if (!_path) return;

    function tryGetPath(_path) {
      try {
        const extensions = ["lua", "luau", "json", "txt"];
        const isDirectory =
          fs.existsSync(_path) && fs.statSync(_path).isDirectory();

        const paths = isDirectory
          ? extensions.map((e) => path.resolve(_path, `init.${e}`))
          : path.extname(_path)
            ? [_path]
            : extensions.map((e) => `${_path}.${e}`);

        for (const _path of paths) {
          if (
            fs.existsSync(_path) &&
            extensions.some((e) => _path.endsWith(`.${e}`))
          ) {
            return _path;
          }
        }
      } catch {}
    }

    let result = tryGetPath(_path);
    if (result) return result;

    if (
      typeof args === "object" &&
      args.join("/").startsWith("include/node_modules/")
    ) {
      result = tryGetPath(
        path.resolve(config.nodeModules, args.splice(2).join("/")),
      );
    } else if (
      typeof args === "string" &&
      args.split(".").splice(-2, 1).join() === "include"
    ) {
      result = tryGetPath(path.resolve(config.include, args.split(".").pop()));
    }

    if (result) return result;
  }

  function processPath(_path) {
    if (!_path || paths.has(_path) || _path === filePath) return;

    const contents = fs.readFileSync(_path, "utf8");
    if (!contents) return;

    paths.add(_path);
    paths = new Set([...paths, ...fetchFiles(contents, _path, attemptedPaths)]);
  }

  const tsImportRegex = /TS\.import\(([^)]+)\)/g;
  const requireRegex = /require\(([^)]+)\)/g;

  let paths = new Set();
  if (!attemptedPaths) attemptedPaths = new Set();
  attemptedPaths.add(filePath);

  let match;

  while ((match = tsImportRegex.exec(contents)) !== null) {
    const args =
      match[1] &&
      match[1].split(",").map((arg) => arg.trim().replace(/^"|"$/g, ""));
    args.shift();

    processPath(getPath(toPath(args)));
  }

  while ((match = requireRegex.exec(contents)) !== null) {
    processPath(getPath(toPath([match[1]], match[1])));
  }

  return paths;
}

function prepareFiles(files) {
  const existingFiles = fs.readdirSync(outFolder, { recursive: true });

  for (let file of existingFiles) {
    file = path.resolve(outFolder, file);

    try {
      if (!fs.statSync(file).isDirectory() && !files.includes(file)) {
        fs.rmSync(file, { force: true });
      }
    } catch {}
  }
}

function moveFiles(files) {
  files = files.map((f) => ({
    path: f,
    newPath: path.resolve(config.include, f.replace(`${root}/`, "")),
  }));

  for (const { path, newPath } of files) {
    try {
      fs.cpSync(path, newPath, { recursive: true, force: true });
    } catch {}
  }
}

function prepareLuaFile(_path) {
  const contents = fs.readFileSync(_path, "utf8");
  const files = [_path, ...fetchFiles(contents, _path)];

  prepareFiles(files.filter((f) => f.startsWith(outFolder)));
  moveFiles(files.filter((f) => !f.startsWith(outFolder)));
}

function clean(folders) {
  for (const folder of folders) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
}

function minify(file) {
  minifier.minifyFile(
    file,
    null,
    path.resolve(__dirname, "config", `${path.basename(file)}.json`),
  );
}

const root = path.resolve(__dirname, "..", "..", "..");
const outFolder = path.resolve(root, "out");
const assetsFolder = path.resolve(root, "assets");

const config = {
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

  const elapsed = measure(function () {
    try {
      clean(config.clean);
      build.handler({
        project: ".",
        rojo: config.rojoConfig,
        includePath: config.include,
      });
    } catch {
      spinner.error("Failed to build");
      process.exit(1);
    }

    try {
      spinner.text = "Bundling";
      spinner.color = "yellow";

      prepareLuaFile(config.input);
      bundler(config.folder, path.basename(config.output));
    } catch {
      spinner.error("Failed to bundle");
      process.exit(1);
    }

    try {
      spinner.text = "Moving Files";
      spinner.color = "magenta";

      clean(config.clean);
      fs.mkdirSync(config.folder, { recursive: true });
      fs.renameSync(path.basename(config.output), config.output);
    } catch {
      spinner.error("Failed to move files");
      process.exit(1);
    }

    try {
      spinner.text = "Minifying";
      spinner.color = "green";

      minify(config.output);
      fs.cpSync(config.output, config.outputMin, { force: true });

      minifier.cleanFile(config.outputMin);
      minify(config.outputMin);
    } catch {
      spinner.error("Failed to minify");
      process.exit(1);
    }
  });

  spinner.success(`Built (took ${elapsed}ms)`);
}

main();
module.exports = main;
