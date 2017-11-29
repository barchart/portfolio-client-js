var gulp = require('gulp');

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var bump = require('gulp-bump');
var git = require('gulp-git');
var gitStatus = require('git-get-status');
var glob = require('glob');
var helpers = require('babelify-external-helpers');
var jasmine = require('gulp-jasmine');
var jsdoc = require('gulp-jsdoc3');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

var fs = require('fs');

function getVersionFromPackage() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function getVersionForComponent() {
    return getVersionFromPackage().split('.').slice(0, 2).join('.');
}

gulp.task('ensure-clean-working-directory', function() {
    gitStatus(function(err, status) {
        if (err, !status.clean) {
            throw new Error('Unable to proceed, your working directory is not clean.');
        }
    });
});

gulp.task('bump-version', function () {
    return gulp.src([ './package.json', './bower.json' ])
        .pipe(bump({ type: 'patch' }).on('error', util.log))
        .pipe(gulp.dest('./'));
});

gulp.task('document', function (cb) {
	config = {
		"opts": {
			"destination": "./docs"
		},
	};

	gulp.src(['README.md', './lib/**/*.js' ], {read: false})
		.pipe(jsdoc(config, cb));
});

gulp.task('commit-changes', function () {
    return gulp.src([ './', './test/dist/', './package.json', './bower.json' ])
        .pipe(git.add())
        .pipe(git.commit('Release. Bump version number'));
});

gulp.task('push-changes', function (cb) {
    git.push('origin', 'bryan/es6-upgrade', cb);
});

gulp.task('create-tag', function (cb) {
    var version = getVersionFromPackage();

    git.tag(version, 'Release ' + version, function (error) {
        if (error) {
            return cb(error);
        }

        git.push('origin', 'bryan/es6-upgrade', { args: '--tags' }, cb);
    });
});

gulp.task('build-browser-tests', function () {
    return browserify({ entries: glob.sync('test/specs/**/*.js') }).bundle()
        .pipe(source('barchart-marketdata-utilities-tests-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('test/dist'));
});

gulp.task('execute-browser-tests', function () {
    return gulp.src('test/dist/barchart-marketdata-utilities-tests-' + getVersionForComponent() + '.js')
        .pipe(jasmine());
});

gulp.task('execute-node-tests', function () {
    return gulp.src(['lib/index.js', 'test/specs/**/*.js'])
        .pipe(jasmine());
});

gulp.task('execute-tests', function (callback) {
    runSequence(
        'build-browser-tests',
        'execute-node-tests',

        function (error) {
            if (error) {
                console.log(error.message);
            }

            callback(error);
        });
});

gulp.task('test', [ 'execute-tests' ]);

gulp.task('release', function (callback) {
    runSequence(
        'ensure-clean-working-directory',
        'build-browser-tests',
        'execute-tests',
		'document',
        'bump-version',
        'commit-changes',
        'push-changes',
        'create-tag',

        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Release complete');
            }

            callback(error);
        });
});

gulp.task('lint', function() {
    return gulp.src([ './lib/**/*.js', './test/specs/**/*.js' ])
        .pipe(jshint({'esversion': 6}))
        .pipe(jshint.reporter('default'));
});

gulp.task('default', [ 'lint' ]);