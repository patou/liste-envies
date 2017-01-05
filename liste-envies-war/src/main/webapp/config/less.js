/*eslint-env node */
/*global module: true */

/**
 * This module will initialize the gulp task for less
 *
 * @author Julien Roche
 * @version 1.0
 */

'use strict';

var options = require('../gulp-options');
var gulp = require('gulp');
var less = require('gulp-less');

var runSequence = require('run-sequence');

gulp.task('less:generate', function () {
    return gulp
        .src('common/styles/index.less', {'cwd': options.srcFolderPath})
        .pipe(less())
        .pipe(gulp.dest('common/styles', {'cwd': options.srcFolderPath}));
});

gulp.task('less:watch', function() {
    gulp.watch(options.srcFolderPath + '/**/*.less', ['less:generate']);  // Watch all the .less files, then run the less task
});

module.exports = function(callback) {
    if (process.argv.indexOf('--watch') >= 0) {
        return runSequence('less:generate', 'less:watch', callback);
    }

    return runSequence('less:generate', callback);
};
