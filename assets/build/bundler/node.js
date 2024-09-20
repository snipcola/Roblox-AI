"use strict";
var NodeType;
Object.defineProperty(exports, "__esModule", {
  value: !0,
}),
  (exports.Node = exports.NodeType = void 0);
const path_1 = require("path");
!(function (e) {
  (e[(e.Folder = 0)] = "Folder"), (e[(e.Module = 1)] = "Module");
})((NodeType = exports.NodeType || (exports.NodeType = {})));
class Node {
  constructor(e, t) {
    (this.type = e),
      (this.path = t),
      (this.children = new Set()),
      (this.basename = (0, path_1.basename)(this.path));
  }
  addChild(e) {
    return this.children.add(e), e;
  }
  getChildNode(e, t) {
    let d = new Node(e, t);
    return this.addChild(d);
  }
  hasChildren() {
    return this.children.size > 0;
  }
  toString() {
    return this.basename + (this.type == NodeType.Folder ? " (dir)" : "");
  }
  find(e) {
    for (let t of this.children) if (e(t)) return t;
  }
  findFirstChild(e) {
    return this.find((t) => t.basename == e);
  }
  flatten() {
    let e = [this];
    for (let t of this.children) {
      let d = t.flatten();
      for (let i of d) e.push(i);
    }
    return e;
  }
}
exports.Node = Node;
