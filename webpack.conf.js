var webpack = require('webpack');
var globby  = require('globby');
var path    = require('path');

var modules = globby.sync('./src/modules/*/index.js');

var entries = {
  main: './src/entry.js'
};

modules.forEach(function(filePath) {
  var name = path.basename(path.dirname(filePath));
  entries[name] = filePath;
});

module.exports = {
  entry: entries,
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
