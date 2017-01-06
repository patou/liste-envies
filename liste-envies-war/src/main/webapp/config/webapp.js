/*eslint-env node */
/*global require: true, module: true */

'use strict';

var options = require('../gulp-options.js');
var less = require('gulp-less');
var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps'),
    useref = require('gulp-useref'),
    lazypipe = require('lazypipe');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

var runSequence = require('run-sequence');
var fs = require('fs');
var path = require('path');

var gnf = require('gulp-npm-files');


gulp.task('webapp:clean', function () {
    if (!fs.existsSync(options.targetFolderPath)) {
        fs.mkdirSync(options.targetFolderPath);
    }
    if (!fs.existsSync(options.tempFolderPath)) {
        fs.mkdirSync(options.tempFolderPath);
    }
    return gulp
        .src([options.targetFolderPath + '/webapp', options.tempFolderPath], { 'read': false })
        .pipe(clean({ 'force': true }));
});

// ----- To .temp

/*gulp.task('webapp:copy-styles', function () {
    return gulp
        .src('common/styles/index.less', { 'cwd': options.srcFolderPath })
        .pipe(less({
            'compress': false,
            'modifyVars': {
                'amazon-assets-path': '"../assets"',
                'icon-font-path': '"./"' // Replace the @icon-font-path bootstrap variable to have the right path!
            }
        }))
        .pipe(gulp.dest(options.tempFolderPath + '/common/styles'))
        .on('error', gutil.log);
});*/

gulp.task('webapp:templates', function templateGeneration() {
    return gulp.src(['**/*.html', '!index.html'], { 'cwd': options.srcFolderPath })
        .pipe(templateCache('templates.js', {
            'module': 'app.templates',
            'standalone': true,
            'moduleSystem': 'IIFE' // Immediately-Invoked Function Expression
        }))
        .pipe(gulp.dest(options.tempFolderPath+'/js'));
});

gulp.task('webapp:copy-index', function () {
    return gulp.src(['index.html'], { 'cwd': options.srcFolderPath })
        .pipe(gulp.dest(options.tempFolderPath));
});

gulp.task('webapp:copy-css', function () {
    return gulp.src(['css/*.css'], { 'cwd': options.srcFolderPath })
        .pipe(gulp.dest(options.tempFolderPath+'/css'));
});

gulp.task('webapp:copy-js', function () {
    return gulp.src(['js/**/*.js', 'js/**/*.css'], { 'cwd': options.srcFolderPath })
        .pipe(gulp.dest(options.tempFolderPath+'/js'));
});

gulp.task('webapp:copy-font-awesome', function () {
    return gulp.src(['font-awesome/**/*'], { 'cwd': options.srcFolderPath })
        .pipe(gulp.dest(options.tempFolderPath+'/font-awesome'));
});


// Séparer en plusieurs taches, car cela semble ne pas aller jusqu'au bout, et ne pas copier les derniers eléments.
gulp.task('webapp:copyNpmDependenciesOnly', function() {
    var listDependencies = gnf();
    gulp.src(listDependencies.slice(0,10), {base: options.srcFolderPath}).pipe(gulp.dest(options.tempFolderPath));
});


gulp.task('webapp:copyNpmDependenciesOnly2', function() {
    var listDependencies = gnf();
    gulp.src(listDependencies.slice(10), {base: options.srcFolderPath}).pipe(gulp.dest(options.tempFolderPath));
});



// ----- To target/webapp

/*gulp.task('webapp:copy-bootstrap-resources', function () {
   return gulp.src(['fonts/!**!/!*'], { 'cwd': options.nodeModulesFolderPath + '/bootstrap' })
       .pipe(gulp.dest(options.targetFolderPath + '/webapp/styles'));
});*/

gulp.task('webapp:copy-internal-resources', function () {
    return gulp.src([ 'fonts/*','lang/*.json', 'font-awesome/*', 'images/*'], { 'cwd': options.srcFolderPath, base: options.srcFolderPath }) // JSON files, images, ...
        .pipe(gulp.dest(options.targetFolderPath + '/webapp'));
});



gulp.task('webapp:copy-fonts', function () {
    return gulp.src(['font-awesome/fonts/*'], { 'cwd': options.srcFolderPath }) // JSON files, images, ...
        .pipe(gulp.dest(options.targetFolderPath + '/webapp/fonts'));
});

gulp.task('webapp:copy-fonts-summernotes', function () {
    return gulp.src(['js/lib/summernotes/font/*'], { 'cwd': options.srcFolderPath }) // JSON files, images, ...
        .pipe(gulp.dest(options.targetFolderPath + '/webapp/styles/font/'));
});

gulp.task('webapp:useref-webapp', function () {
    return gulp.src(options.tempFolderPath + '/index.html')
        .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulpIf('*.js', uglify({ 'mangle': false })))
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(gulp.dest(options.targetFolderPath + '/webapp'));
});

module.exports = function (callback) {
    return runSequence(
        'webapp:clean',
        'webapp:copyNpmDependenciesOnly',
        'webapp:copyNpmDependenciesOnly2',
        [
            'webapp:copy-index',
            'webapp:copy-css',
            'webapp:copy-js',
            'webapp:copy-font-awesome',
            'webapp:templates'
        ],
        [
            'webapp:useref-webapp',
            'webapp:copy-internal-resources',
            'webapp:copy-fonts',
            'webapp:copy-fonts-summernotes'
        ],
        callback
    );
};
