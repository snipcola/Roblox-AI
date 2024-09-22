const fs = require("fs");
const path = require("path");

const build = require("roblox-ts/out/CLI/commands/build");
const { measure } = require("../shared/functions");

const bundler = require("./bundler");
const minifier = require("darklua-bin-wrapper");

function fetchDirectory(originalPath) {
  let path;

  function getParent(_path) {
    const array = _path.split("/");
    return array.splice(0, array.length - 1).join("/");
  }

  function check(_path) {
    function checkParent() {
      const parent = getParent(_path);
      if (parent) check(parent);
    }

    if (fs.existsSync(_path) && fs.statSync(_path).isDirectory()) path = _path;
    else checkParent();
  }

  check(originalPath);
  return path;
}

function fetchModules(contents) {
  const tsImportRegex = /TS\.import\(([^)]+)\)/g;
  const requireRegex = /local\s+TS\s*=\s*require\(([^)]+)\)/g;

  const paths = [];
  let match;

  while ((match = tsImportRegex.exec(contents)) !== null) {
    const args = match[1];
    const argArray = args.split(",").map((arg) => arg.trim());

    if (argArray.some((arg) => arg.includes("node_modules"))) {
      const nodeModulesIndex = argArray.findIndex((arg) =>
        arg.includes("node_modules"),
      );
      const pathParts = argArray
        .slice(nodeModulesIndex)
        .map((arg) => arg.replace(/['"]/g, "").trim());
      const path = pathParts.join("/");
      const directory = fetchDirectory(path);

      if (directory) paths.push(directory);
    }
  }

  if ((match = requireRegex.exec(contents)) !== null) {
    const arg = match[1];

    if (arg === "script.include.RuntimeLib") {
      paths.push("include/RuntimeLib.lua");
      paths.push("include/Promise.lua");
    }
  }

  return paths;
}

function findInitFiles(module) {
  const paths = [];

  try {
    const files = fs.readdirSync(module);

    files.forEach(function (file) {
      const filePath = path.join(module, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        paths.push(...findInitFiles(filePath));
      } else if (file.endsWith(".lua") || file.endsWith(".luau")) {
        paths.push(filePath);
      }
    });
  } catch {
    return;
  }

  return paths;
}

function moveFile(file) {
  const _path = file.startsWith("include")
    ? path.resolve(config.folder, file)
    : path.resolve(config.folder, "include", file);
  const directory = path.dirname(_path);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.copyFileSync(file, _path);
}

function prepareLuaFile(path) {
  const contents = fs.readFileSync(path, "utf8");
  const modules = fetchModules(contents);
  const files = modules
    .map((m) => (m.startsWith("include") ? m : findInitFiles(m)))
    .flat()
    .filter((v) => typeof v === "string");

  [...new Set(files)].map(moveFile);
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

const config = {
  folder: outFolder,
  clean: [outFolder, path.resolve(root, "include")],
  input: path.resolve(root, outFolder, "init.luau"),
  output: path.resolve(root, outFolder, "script.lua"),
  outputMin: path.resolve(root, outFolder, "script.min.lua"),
};

async function main() {
  const { default: yocto } = await import("yocto-spinner");
  const spinner = yocto({ text: "Building", color: "blue" }).start();

  const elapsed = measure(function () {
    try {
      clean(config.clean);
      build.handler({ project: "." });
    } catch {
      return spinner.error("Failed to build");
    }

    try {
      spinner.text = "Bundling";
      spinner.color = "yellow";

      prepareLuaFile(config.input);
      bundler(config.folder, path.basename(config.output));
    } catch {
      return spinner.error("Failed to bundle");
    }

    try {
      spinner.text = "Moving Files";
      spinner.color = "magenta";

      clean(config.clean);
      fs.mkdirSync(config.folder, { recursive: true });
      fs.renameSync(path.basename(config.output), config.output);
    } catch {
      return spinner.error("Failed to move files");
    }

    try {
      spinner.text = "Minifying";
      spinner.color = "green";

      minify(config.output);
      fs.copyFileSync(config.output, config.outputMin);

      minifier.cleanFile(config.outputMin);
      minify(config.outputMin);
    } catch {
      return spinner.error("Failed to minify");
    }
  });

  spinner.success(`Built (took ${elapsed}ms)`);
}

main();
module.exports = main;
