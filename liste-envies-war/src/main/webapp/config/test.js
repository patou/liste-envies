/*eslint-env node */
/*global require: true, process: true, module: true */

'use strict';

var options = require('../gulp-options.js'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean');

var lodash = require('lodash'),
    karma = require('karma').server,
    through2 = require('through2'),
    runSequence = require('run-sequence');

/**
 * Return a gulp pipe for the Karma process
 *
 * @method
 * @private
 * @param {Object} options
 * @returns {Function}
 */
function karmaGulpStream(options) {
    return through2.obj(function (file, enc, cb) {
        var extendedOptions = lodash.extend({}, options, {'configFile': file.path});

        karma.start(
            extendedOptions,
            function (exitCode) {
                if (exitCode) {
                    this.emit('error', new gutil.PluginError('gulp-karma', 'Exit code with ' + exitCode));
                    this.push(file);
                    cb();

                } else {
                    this.push(file);
                    cb();
                }

            }.bind(this)
        );
    });
}

gulp.task('test:clean', function () {
    return gulp
        .src([options.targetFolderPath + '/test-reports',options.targetFolderPath + '/coverage'], {'read': false})
        .pipe(clean({'force': true}));
});

gulp.task('test:karma', function () {
    return gulp
        .src([options.dirname + '/karma.conf.js'])
        .pipe(karmaGulpStream({
            'runnerPort': 9999,
            'singleRun': true,
            'autoWatch' : true,
            'browsers': ['PhantomJS'],
            'reporters': ['progress', 'junit', 'coverage'],
            'junitReporter': {
                useBrowserName : false,
                'outputFile': options.targetFolderPath + '/test-reports/mocha-report-junit.xml',
                'suite': 'unit'
            },
            'coverageReporter': {
                useBrowserName : false,
                'reporters': [
                    {
                        'type': 'cobertura',
                        'dir': options.targetFolderPath + '/coverage/cobertura',
                        'file': 'report-test-cobertura.xml',
                        'subdir':  subdirFromBrowser
                    },
                    {
                        'type': 'lcovonly',
                        'dir': options.targetFolderPath + '/coverage/lcov',
                        'subdir':  subdirFromBrowser
                    },
                    {
                        'type': 'text'
                    },
                    {
                        'type': 'html',
                        'dir': options.targetFolderPath + '/coverage/html',
                        'subdir':  subdirFromBrowser
                    }
                ]
            }
        }));
});

function subdirFromBrowser(browser) {
    return browser.toLowerCase().split(/[ /-]/)[0];
}

module.exports = function () {
    return runSequence('test:clean', 'test:karma', function () {
        process.exit(0);
    });
};
