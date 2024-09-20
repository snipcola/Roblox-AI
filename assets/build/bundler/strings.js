"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0,
}),
  (exports.stringifyFooter =
    exports.stringifyTree =
    exports.stringifyJSON =
    exports.stringifyModule =
    exports.polyfillString =
      void 0);

exports.polyfillString = `
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
`;
const stringifyModule = (e, r) =>
  `
	__chunks[${e}] = function(script)
		${r ? "\n	" : ""}${r.trim()}
	end
	`;
exports.stringifyModule = stringifyModule;
const stringifyJSON = (e, r) => {
  let t = JSON.stringify(JSON.stringify(JSON.parse(r)));
  return `
	__chunks[${e}] = __.a(${t})	
	`;
};
exports.stringifyJSON = stringifyJSON;
const stringifyTree = (e) => {
  let r = JSON.stringify(JSON.stringify(e));
  return `
	__.b(${r})
	`;
};
exports.stringifyTree = stringifyTree;
const stringifyFooter = (e) => `return require("${e}")`;
exports.stringifyFooter = stringifyFooter;
