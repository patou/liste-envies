/*eslint-env node */
/*global require: true, module: true */

'use strict';

var options = require('../gulp-options.js'),
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    jsdoc = require('gulp-jsdoc');

var babel = require('gulp-babel');

var fs = require('fs');
var path = require('path');

var babelOptions = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, '../.babelrc'))));


var runSequence = require('run-sequence');

gulp.task('documentation:clean', function () {
    return gulp
        .src([ options.targetFolderPath + '/doc' ], { 'read': false })
        .pipe(clean({ 'force': true }));
});

gulp.task('documentation:jsdoc', function () {
    return gulp
        .src(options.tempFolderPath + '/**/*.js')
        .pipe(jsdoc(options.targetFolderPath + '/doc'));
});

gulp.task('tempFolder:clean', function () {
    return gulp
        .src([ options.tempFolderPath  ], { 'read': false })
        .pipe(clean({ 'force': true }));
});

gulp.task('documentation:transpile-webapp', function () {
    return gulp.src(['**/*.es6', '!templates.es6'], { 'cwd': options.srcFolderPath })
        .pipe(babel(babelOptions))
        .pipe(gulp.dest(options.tempFolderPath));
});

module.exports = function() {
    return runSequence('documentation:clean', 'documentation:transpile-webapp', 'documentation:jsdoc', 'tempFolder:clean');
};
