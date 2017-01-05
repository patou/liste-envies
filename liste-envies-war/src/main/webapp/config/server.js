/*eslint-env node */
/*global require: true, module: true */

'use strict';

var options = require('../gulp-options.js'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

var proxy = require('http-proxy-middleware'),
    runSequence = require('run-sequence');



gulp.task('server:connect', function () {
    gutil.log('You will access to the server to the following link:');
    gutil.log('http://localhost:3000/app/index.html');

    connect.server({
        'host': 'localhost',
        'https': false,
        'root': './',
        'port': 3001,
        'middleware': function() {
            return [
                proxy('/api', {
                    'target': options.proxyURL,
                    'secure': false,
                    'changeOrigin': true
                })
            ];
        }
    });
});

gulp.task('server:open_browser', function () {
    gulp.src('')
        .pipe(open({uri: 'http://localhost:3001/app/index.html'}));
});


module.exports = function (callback) {
    return runSequence(
        'server:connect',
        'server:open_browser',
        callback
    );
};
