const fs = require("fs/promises");
const process = require("process");

const { spawn } = require("child_process");
const { blue, green, red } = require("colorette");

function info(message) {
  console.log(blue(`i ${message}`));
}

function success(message) {
  console.log(green(`√ ${message}`));
}

function error(exit, message) {
  if (message) {
    console.error(red(`× ${message}`));
  }

  if (exit) {
    process.exit(1);
  }
}

async function measure(callback) {
  const start = performance.now();
  await callback();

  const end = performance.now();
  return (end - start).toFixed(2);
}

function executeCommand(command, args, cwd) {
  return new Promise(async function (resolve) {
    const useCMD =
      process.platform === "win32" && !command?.toLowerCase()?.endsWith(".exe");
    const result = await spawn(
      useCMD ? "cmd.exe" : command,
      useCMD ? ["/c", command, ...args] : args,
      {
        cwd,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let output = "";
    let error = "";

    result.stdout.on("data", function (data) {
      output += data;
    });

    result.stderr.on("data", function (data) {
      error += data;
    });

    result.on("close", function (code) {
      resolve({
        success: code === 0,
        output,
        error,
      });
    });
  });
}

async function clean(folders) {
  await Promise.all(
    folders.map((f) => fs.rm(f, { recursive: true, force: true })),
  );
}

module.exports = {
  measure,
  executeCommand,
  clean,
  info,
  success,
  error,
};
