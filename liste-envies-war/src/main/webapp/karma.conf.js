/*eslint-env node */
/*global module: true, __dirname: true */

'use strict';

var fs = require('fs');
var path = require('path');

var babelOptions = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, './.babelrc'))));
babelOptions.sourceMap = 'inline';

// Karma configuration

/**
 * Karma configuration
 * For running tests under PhantomJs, Chrome ... with Jasmine.
 * For generating reports compliant for jUnit, CheckStyle, Cobertura ...
 */
module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        'basePath': './',

        // frameworks to use
        'frameworks': ['mocha', 'chai', 'sinon'],

        // list of files / patterns to load in the browser
        'files': [
			'node_modules/angular/angular.js',
			'node_modules/angular-animate/angular-animate.js',
			'node_modules/angular-ui-router/release/angular-ui-router.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'node_modules/angular-translate/dist/angular-translate.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
			'node_modules/angular-toastr/dist/angular-toastr.tpls.js',
            'node_modules/angular-scroll/angular-scroll.js',
            'node_modules/angular-sanitize/angular-sanitize.js',

            'node_modules/ng-device-detector/node_modules/re-tree/re-tree.js',
            'node_modules/ng-device-detector/ng-device-detector.js',


            'node_modules/lodash/lodash.js',
            'node_modules/filesaver.js/FileSaver.js',
            'node_modules/ng-tags-input/build/ng-tags-input.js',



            { 'pattern': 'app/**/index.es6', 'included': true }, // First, always load file which can contains module definition
            { 'pattern': 'app/**/*.es6', 'included': true },
            { 'pattern': 'app/**/*.html', 'included': true }, // For the template cache
            { 'pattern': 'test/**/*-spec.js', 'included': true }
        ],

        // list of files to exclude
        'exclude': [
			'app/index.html'
        ],

        'client': {
            'mocha': {
                'timeout': 10000
            }
        },

        // Plugins
        'plugins': [ // See http://stackoverflow.com/questions/16905945/can-you-define-custom-plugins-for-karma-runner
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-junit-reporter',
            'karma-coverage',
			'karma-ng-html2js-preprocessor',
            'karma-babel-preprocessor',
            'karma-sourcemap-loader'
        ],

        // Preprocessors
        'preprocessors': {
			'app/**/*.html': ['ng-html2js'],
            'app/**/*.es6': ['babel', 'coverage'],
            'test/**/*.es6': ['babel']
        },

        'babelPreprocessor': {
            'options': babelOptions
        },

        'ngHtml2JsPreprocessor': {
            // strip this from the file path
            'stripPrefix': 'app/',

            // setting this option will create only a single module that contains templates
            // from all the files, so you can load them all with module('templates')
            'moduleName': 'allTemplatesForTests'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        'reporters': ['progress'],

        // web server port
        'port': 9876,

        // cli runner port
        'runnerPort': 9100,

        // enable / disable colors in the output (reporters and logs)
        'colors': true,

        // level of logging
        // possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
        'logLevel': config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        'autoWatch': false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        'browsers': ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        'captureTimeout': 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        'singleRun': true
    });
};
