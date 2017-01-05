/*eslint-env node */
/*global require: true, module: true */

'use strict';

var options = require('../gulp-options.js'),
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    eslint = require('gulp-eslint');

var runSequence = require('run-sequence'),
    fs = require('fs');

gulp.task('checkstyle:clean', function () {
    return gulp
        .src([options.targetFolderPath + '/eslint-report-checkstyle.xml'], { 'read': false })
        .pipe(clean({'force': true}));
});

gulp.task('checkstyle:eslint', function () {
    return gulp
        .src(options.jsFolderPath)
        .pipe(eslint({'useEslintrc': true}))
        .pipe(eslint.format('checkstyle', function (output) {
            if (!fs.existsSync(options.targetFolderPath)) {
                fs.mkdirSync(options.targetFolderPath);
            }

            fs.writeFileSync(options.targetFolderPath + '/eslint-report-checkstyle.xml', output);
        }));
});

module.exports = function () {
    return runSequence('checkstyle:clean', 'checkstyle:eslint');
};
