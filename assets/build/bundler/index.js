const bundler = require("./bundler");

module.exports = async function (path, output) {
  await bundler.bundle(path, { output });
};
