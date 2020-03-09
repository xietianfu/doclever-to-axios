/**
 * 字符串驼峰化
 * @param {string} str 传入字符串
 */
function camelize(str) {
  return str.replace(/[-_\s]+(.)?/g, function(match, c) {
    return c ? c.toUpperCase() : "";
  });
}

module.exports = {
  camelize
};
