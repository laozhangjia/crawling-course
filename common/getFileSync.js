var fs = require('fs');
var getFile = function (path) {
    return fs.readFileSync(path, {encoding: 'utf-8'});
};
module.exports = getFile;