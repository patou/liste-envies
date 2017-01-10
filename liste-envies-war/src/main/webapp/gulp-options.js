/*eslint-env node */
/*global module: true, __dirname: true */

'use strict';

module.exports = {
    'targetFolderPath': './target/liste-envies-war/dist/',
    'tempFolderPath': __dirname + '/.temp',
    'distFolderPath': './dist',
    'srcFolderPath': './',
    'index': './app/index.html',
    'ignoreRoute': 'app',
    'js': ['./js/**/*.js'],
    'jsFolderPath': './js/**/*.js',
    'nodeModulesFolderPath': './node_modules',
    'dirname': __dirname
};
