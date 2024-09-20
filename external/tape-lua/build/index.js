#!/usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const commander_1 = require("commander"),
  bundler_1 = require("./bundler"),
  program = new commander_1.Command("tape");
program
  .argument("[target]", "target folder to bundle")
  .option("-v --verbose", "enable verbose output", !1)
  .option("-x --experimental", "enable experimental path naming", !1)
  .helpOption("-h --help", "display help for tape"),
  program.parse(),
  (async () => {
    try {
      await (0, bundler_1.bundle)(program.args[0], program.opts());
    } catch (e) {
      e instanceof Error && console.error("Bundle error:", e.message);
    }
  })().catch(console.error);
