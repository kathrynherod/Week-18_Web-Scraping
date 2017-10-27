// Exporting an object containing all of our models
// var path      = require('path');
// var basename = path.basename(module.filename);

module.exports = {
  Article: require("./Article"),
  Note: require("./Note")
};