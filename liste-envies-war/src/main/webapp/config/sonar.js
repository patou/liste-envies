/*eslint-env node */
/*global require: true, process: true, */
'use strict';

var gulpOptions = require('../gulp-options.js'),
    gulp = require('gulp'),
    sonar = require('gulp-sonar'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence'),
    fs = require('fs');

var packageJson = JSON.parse(fs.readFileSync('./package.json'));


function onError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('sonar:run', function(){
    var options = {
        sonar: {
            host: {
                url: 'http://vps258120.ovh.net:9000'
            },

            login: '221e8bf90ca4d4921df0c67968e50a5411608827',

            projectKey: 'amazon:amazon-frontend',
            projectName: 'Amazon Frontend',
            projectVersion: packageJson.version,

            sources: 'app',
            inclusions: '**/*.es6',

            tests: 'test',

            lang:{patterns:{js:'**/*.es6'}},

            language: ['js'],

            sourceEncoding: 'UTF-8',
            javascript: {
                file: {
                    suffixes: '.es6'
                },
                lcov: {
                    reportPath: gulpOptions.targetFolderPath + '/coverage/lcov/phantomjs/lcov.info'
                },
                karmajstestdriver: {
                    reportsPath: gulpOptions.targetFolderPath + '/test-reports'
                }
            }
        }
    };
    gulp.src('thisFileDoesNotExist.js', { read: false })
        .pipe(sonar(options))
        .on('error', onError);
});

module.exports = function (callback) {
    return runSequence('sonar:run', callback);
};
