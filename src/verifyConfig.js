const files = require("../constants/files");
const paths = require("../constants/paths");
const chalk = require("chalk");
const isEmpty = require("lodash.isempty");

function isEmptyParam(param, msg) {
  if (isEmpty(param)) {
    console.log(chalk.red(msg));
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isEmptyParam
};
