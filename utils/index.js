/**
 * 字符串驼峰化
 * @param {string} str 传入字符串
 */
function camelize(str) {
  return str.replace(/[-_\s]+(.)?/g, function(match, c) {
    return c ? c.toUpperCase() : "";
  });
}

function isBasePath(path) {
  if (path === "/") {
    return true;
  } else if (/^[A-Z]:\\$/.test(path)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  camelize,
  isBasePath
};
