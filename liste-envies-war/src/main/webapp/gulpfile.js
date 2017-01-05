/*eslint-env node */
/*global require: true*/

/**
 * Gulp file declaration
 */

'use strict';

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');


// Load gulp task automatically (only one !)
var taskName = process.argv[2];
var modulePath = './config/' + taskName;
var gulpTaskPath = path.resolve(path.join(__dirname, modulePath + '.js'));

if (fs.existsSync(gulpTaskPath)) {
    // We load it !!
    var taskinfo = require(modulePath);

    gulp.task.apply(gulp, [taskName].concat(taskinfo));
}

// A very basic defaukt task.
gulp.task('default', function () {
    console.log('Logging some stuff...');
});
