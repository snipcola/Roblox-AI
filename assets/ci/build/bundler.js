const fs = require("fs");
const _path = require("path");

class Node {
  constructor(type, path) {
    this.type = type;
    this.path = path;
    this.children = new Set();
    this.basename = _path.basename(this.path);
  }

  addChild(node) {
    this.children.add(node);
    return node;
  }

  getChildNode(type, path) {
    return this.addChild(new Node(type, path));
  }

  toString() {
    return `${this.basename}${this.type === "Folder" ? " (dir)" : ""}`;
  }

  findFirstChild(basename) {
    return Array.from(this.children).find(
      (child) => child.basename === basename,
    );
  }

  flatten() {
    return [
      this,
      ...Array.from(this.children).flatMap((child) => child.flatten()),
    ];
  }
}

class Stringify {
  process(lua) {
    return lua.trim();
  }

  polyfill = this.process(`
    local __ = { a = nil, b = nil, c = nil }
    local __require = require
    local __chunks = {}
    local __cache = {}
    local __scripts = {}
    local __http = game:GetService("HttpService")

    local function require(module)
      if typeof(module) == "Instance" then
        module = __scripts[module] or module
      end

      if typeof(module) ~= "string" then
        return __require(module)
      end

      local fn = __chunks[module]
      if not fn then return end

      local cached = __cache[module]
      if cached then return cached.value end

      local success, result = pcall(fn, __scripts[module])
      if not success then return end

      __cache[module] = { value = result }
      task.wait()
      return result
    end

    __.a = function(str)
      return function() return __http:JSONDecode(str) end
    end

    __.c = function (t, parent)
      local pair, children = unpack(t)
      local name, link = unpack(pair)
      local proxy = Instance.new(link and "ModuleScript" or "Folder")
      proxy.Parent = parent
      proxy.Name = name
      if link then
        __scripts[proxy] = link
        __scripts[link] = proxy
      end
      for _, v in pairs(children) do __.c(v, proxy) end
      return proxy
    end

    __.b = function(str)
      __.c(__.a(str)())
    end
  `);

  module(name, script) {
    return this.process(`
      __chunks[${name}] = function(script)
        ${script.trim()}
      end
    `);
  }

  prepareJSON(json) {
    return JSON.stringify(JSON.stringify(json));
  }

  json(name, jsonString) {
    return this.process(`
      __chunks[${name}] = __.a(${this.prepareJSON(JSON.parse(jsonString))})
    `);
  }

  text(name, textString) {
    return this.json(name, JSON.stringify(textString));
  }

  tree(json) {
    return this.process(`
      __.b(${this.prepareJSON(json)})
    `);
  }

  footer(name) {
    return this.process(`
      return require("${name}");
    `);
  }
}

const stringify = new Stringify();

class Bundler {
  transformers = [
    {
      extension: [".lua", ".luau"],
      transform: function (name, contents) {
        contents = contents
          .split("")
          .filter((c) => c !== "\r")
          .join("")
          .split("\n")
          .map((l) => `\t${l}`)
          .map((l) => (l === "\t" ? "" : l))
          .join("\n");

        return stringify.module(name, contents);
      },
    },
    {
      extension: ".json",
      transform: stringify.json.bind(stringify),
    },
    {
      extension: ".txt",
      transform: stringify.text.bind(stringify),
    },
  ];

  initFiles = ["init", "index", "main"].flatMap(function (name) {
    return ["lua", "luau"].map((extension) => `${name}.${extension}`);
  });

  getTransformer(extension) {
    return this.transformers.find(function ({ extension: _extension }) {
      return Array.isArray(_extension)
        ? _extension.includes(extension)
        : _extension === extension;
    });
  }

  canBundle(basename) {
    return this.getTransformer(_path.extname(basename)) !== undefined;
  }

  explore(directory, node) {
    if (!node) node = new Node("Folder", directory);
    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
      const path = _path.resolve(directory, file.name);

      if (file.isFile() && this.canBundle(file.name)) {
        node.getChildNode("Module", path);
      } else if (file.isDirectory()) {
        const child = node.getChildNode("Folder", path);
        this.explore(path, child);

        if (child.children.size === 0) {
          node.children.delete(child);
        }
      }
    }

    return node;
  }

  initialize(node) {
    const initNode = this.initFiles
      .map((f) => node.findFirstChild(f))
      .filter((f) => f !== undefined)
      .shift();

    if (initNode && initNode.type === "Module") {
      for (const child of Array.from(node.children).filter(
        (c) => c !== initNode,
      )) {
        initNode.addChild(child);
      }

      initNode.basename = node.basename;

      node.children.clear();
      node = initNode;
    }

    const children = [...node.children].map((c) => this.initialize(c));
    node.children.clear();

    for (const child of children) {
      node.addChild(child);
    }

    return node;
  }

  makeTree(node, names) {
    const extension = _path.extname(node.basename);
    const name = _path.basename(node.basename, extension);

    const module = names.find((n) => n.module === node)?.name;
    const children = [...node.children].map((c) => this.makeTree(c, names));

    return [[name, module], children];
  }

  bundle(path, { output: _output }) {
    if (!fs.statSync(path).isDirectory()) {
      throw new Error("Path is not a directory.");
    }

    path = _path.resolve(path);

    const root = this.explore(path);
    const entryNode = this.initialize(root);

    if (entryNode.type !== "Module") {
      throw new Error("No entrypoint.");
    }

    const entries = entryNode.flatten();
    const modules = entries.filter((n) => n.type === "Module");

    const output = [stringify.polyfill];
    const names = modules.map((module, index) => {
      path = _path.relative(path, module.path);
      const extension = _path.extname(path);

      const transformer = this.getTransformer(extension);
      if (!transformer) throw new Error(`No transformer for ${extension}.`);

      const contents = fs.readFileSync(module.path, "utf8");
      output.push(
        transformer.transform(stringify.prepareJSON(index), contents),
      );

      return {
        name: index.toString(),
        module,
      };
    });

    const tree = this.makeTree(entryNode, names);
    output.push(stringify.tree(tree));

    const name = names.find((n) => n.module === entryNode)?.name;
    if (!name) throw new Error("No name for entry node.");

    output.push(stringify.footer(name));
    fs.writeFileSync(_path.resolve(_output), output.join("\n\n"), "utf8");
  }
}

module.exports = function (path, output) {
  new Bundler().bundle(path, { output });
};
