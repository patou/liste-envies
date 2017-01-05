/*eslint-env node */
/*global require: true, module: true */

'use strict';

var options = require('../gulp-options.js'),
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    webapp = require('./webapp.js');

var runSequence = require('run-sequence'),
    es = require('event-stream');

function onlyFiles() {
    return es.map(function(file, cb) {
        if (file.stat.isFile()) {
            return cb(null, file);

        } else {
            return cb();
        }
    });
};

gulp.task('webapp', function (callback) {
    return webapp(callback);
});

gulp.task('distribution:clean', function () {


    return gulp
        .src([options.distFolderPath], { 'read': false })
        .pipe(clean({'force': true}));
});

gulp.task('distribution:copy', function () {
    return gulp
        .src(['**/*'], { 'cwd': options.targetFolderPath + '/webapp' })
        .pipe(onlyFiles())
        .pipe(gulp.dest(options.distFolderPath));
});

module.exports = function () {
    return runSequence(
        'webapp',
        'distribution:clean',
        'distribution:copy'
    );
};
