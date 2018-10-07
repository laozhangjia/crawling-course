const path = require('path');
window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;