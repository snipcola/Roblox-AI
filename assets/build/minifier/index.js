const os = require("os");
const { execFileSync } = require("child_process");

const fs = require("fs");
const path = require("path");

const platform = os.platform();
const arch = os.arch();

let binaryPath;

function setBinaryPath(binary) {
  binaryPath = path.join(__dirname, "bin", binary);
}

function prepareBinary() {
  try {
    execFileSync("chmod", ["+x", binaryPath]);
    execFileSync("xattr", ["-cr", binaryPath]);
  } catch {}
}

if (platform === "linux") {
  setBinaryPath(
    arch === "arm64" ? "darklua-linux-aarch64" : "darklua-linux-x86_64",
  );
  prepareBinary();
} else if (platform === "darwin") {
  setBinaryPath(
    arch === "arm64" ? "darklua-macos-aarch64" : "darklua-macos-x86_64",
  );
  prepareBinary();
} else if (platform === "win32") {
  setBinaryPath("darklua-windows-x86_64.exe");
} else {
  console.error("Unsupported platform:", platform);
  process.exit(1);
}

function copyFile(file, copy) {
  const contents = fs.readFileSync(file, "utf8");
  fs.writeFileSync(copy, contents, "utf8");
}

function minifyFile(_path) {
  const file = _path.split("/").pop();
  const config = path.join(__dirname, "config", `${file}.json`);
  execFileSync(binaryPath, ["process", "--config", config, _path, _path]);
}

function cleanLua(code) {
  return code
    .replace(/(\r\n|\n|\r)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanFile(file) {
  const contents = cleanLua(fs.readFileSync(file, "utf8"));
  fs.writeFileSync(file, contents, "utf8");
}

function minifyAndCleanFile(file) {
  minifyFile(file);
  cleanFile(file);
  minifyFile(file);
}

module.exports = function (file, minFile) {
  copyFile(file, minFile);
  minifyFile(file);
  minifyAndCleanFile(minFile);
};
