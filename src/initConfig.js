const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("../constants/paths");
const path = require("../constants/files");

inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));

function initConfig() {}
