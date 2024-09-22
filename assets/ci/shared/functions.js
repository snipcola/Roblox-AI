function measure(callback) {
  const start = performance.now();
  callback();

  const end = performance.now();
  return (end - start).toFixed(2)
}

module.exports = {
  measure
};