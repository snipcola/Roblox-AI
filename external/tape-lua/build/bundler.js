"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0,
}),
  (exports.bundle = void 0);
const promises_1 = require("fs/promises"),
  path_1 = require("path"),
  node_1 = require("./node"),
  strings_1 = require("./strings"),
  TRANSFORMERS = [
    {
      ext: [".lua", ".luau"],
      transform(e, t) {
        let n;
        return (
          (n = e
            .split("")
            .filter((e) => "\r" !== e)
            .join("")
            .split("\n")
            .map((e) => "	" + e)
            .map((e) => ("	" === e ? "" : e))
            .join("\n")),
          (0, strings_1.stringifyModule)(t, n ?? e)
        );
      },
    },
    {
      ext: ".json",
      transform: (e, t) => (0, strings_1.stringifyJSON)(t, e),
    },
    {
      ext: ".txt",
      transform: (e, t) => (0, strings_1.stringifyJSON)(t, JSON.stringify(e)),
    },
  ],
  getTransformer = (e) =>
    TRANSFORMERS.find(({ ext: t }) =>
      Array.isArray(t) ? t.includes(e) : t == e,
    ),
  shouldBundle = (e) => {
    let t = (0, path_1.extname)(e);
    return void 0 != getTransformer(t);
  },
  explore2 = async (e, t, n) => {
    n || (n = new node_1.Node(node_1.NodeType.Folder, e));
    let r = await (0, promises_1.readdir)(e, {
      withFileTypes: !0,
    });
    for (let i of r) {
      if (!i.isFile()) continue;
      if (!shouldBundle(i.name)) {
        t && console.log(`IGNORE "${i.name}"`);
        continue;
      }
      t && console.log(`ADD "${i.name}"`);
      let o = (0, path_1.resolve)(e, i.name);
      n.getChildNode(node_1.NodeType.Module, o);
    }
    for (let a of r) {
      if (!a.isDirectory()) continue;
      t && console.log(`EXPLORE "${a.name}"`);
      let l = (0, path_1.resolve)(e, a.name),
        s = n.getChildNode(node_1.NodeType.Folder, l);
      await explore2(l, t, s),
        s.hasChildren() ||
          (t && console.log(`CULL "${a.name}"`), n.children.delete(s));
    }
    return n;
  },
  initify = (e) => {
    let t =
      e.findFirstChild("init.lua") ||
      e.findFirstChild("init.luau") ||
      e.findFirstChild("index.lua") ||
      e.findFirstChild("index.luau");
    if (t && t.type == node_1.NodeType.Module) {
      for (let n of e.children) n != t && t.addChild(n);
      (t.basename = e.basename), e.children.clear(), (e = t);
    }
    let r = [...e.children].map(initify);
    for (let i of (e.children.clear(), r)) e.addChild(i);
    return e;
  },
  printTree = (e, t = 0) => {
    let n = " ".repeat(4 * t);
    for (let r of (console.log(`${n}${e.toString()}`), e.children))
      printTree(r, t + 1);
    0 == t && console.log();
  },
  bundle = async (e, t) => {
    let n = (0, path_1.resolve)(e),
      r = await (0, promises_1.stat)(e);
    if (!r.isDirectory()) throw Error("target is not a directory!");
    let i = await explore2(n, t.verbose);
    t.verbose && (console.log("\nbase tree:"), printTree(i));
    let o = initify(i);
    if (
      (t.verbose && (console.log("\ninitified tree:"), printTree(o)),
      o.type != node_1.NodeType.Module)
    )
      throw Error("bundle has no entrypoint!");
    let a = o.flatten(),
      l = a.filter((e) => e.type == node_1.NodeType.Module),
      s = [strings_1.polyfillString.trim()],
      d = new Map();
    let idx = 0;
    for (let p of l) {
      idx++;
      let f = (0, path_1.relative)(n, p.path),
        h = (0, path_1.extname)(f),
        u = idx.toString(),
        g = JSON.stringify(u);
      d.set(p, g.substring(1, g.length - 1));
      let m = await (0, promises_1.readFile)(p.path, "utf-8"),
        _ = getTransformer(h);
      if (!_) {
        console.warn(`No transformer for "${h}"`);
        continue;
      }
      let y = _.transform(m, g, f, t);
      s.push(y);
    }
    let $ = (e) => {
        let t = [...e.children].map($),
          n = (0, path_1.basename)(e.basename, (0, path_1.extname)(e.basename));
        return [[n, d.get(e)], t];
      },
      c = $(o);
    s.push((0, strings_1.stringifyTree)(c));
    let b = d.get(o);
    if (!b) throw Error("no name for initified node!");
    s.push((0, strings_1.stringifyFooter)(b));
    let T = (0, path_1.resolve)("script.lua");
    await (0, promises_1.writeFile)(T, s.join("\n"), {
      encoding: "utf-8",
      flag: "w",
    });
  };
exports.bundle = bundle;
