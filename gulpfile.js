const gulp = require('gulp');

const fs = require('fs');

const browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	bump = require('gulp-bump'),
	exec = require('child_process').exec,
	git = require('gulp-git'),
	gitStatus = require('git-get-status'),
	glob = require('glob'),
	jasmine = require('gulp-jasmine'),
	jshint = require('gulp-jshint'),
	replace = require('gulp-replace'),
	source = require('vinyl-source-stream');

function getVersionFromPackage() {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

gulp.task('ensure-clean-working-directory', (cb) => {
	gitStatus((err, status) => {
		if (err, !status.clean) {
			throw new Error('Unable to proceed, your working directory is not clean.');
		}

		cb();
	});
});

gulp.task('bump-version', () => {
	return gulp.src([ './package.json' ])
		.pipe(bump({ type: 'patch' }))
		.pipe(gulp.dest('./'));
});

gulp.task('embed-version', () => {
	var version = getVersionFromPackage();

	return gulp.src(['./lib/index.js'])
		.pipe(replace(/(version:\s*')([0-9]+\.[0-9]+\.[0-9]+)(')/g, '$1' + version + '$3'))
		.pipe(gulp.dest('./lib/'));
});

gulp.task('document', (cb) => {
	exec('jsdoc . -c jsdoc.json -r -d docs', (error, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);

		cb();
	});
});

gulp.task('commit-changes', () => {
	return gulp.src([ './', './test/', './package.json', './lib/index.js', './example/example.js', './test/SpecRunner.js' ])
		.pipe(git.add())
		.pipe(git.commit('Release. Bump version number'));
});

gulp.task('push-changes', (cb) => {
	git.push('origin', 'master', cb);
});

gulp.task('create-tag', (cb) => {
	const version = getVersionFromPackage();

	git.tag(version, 'Release ' + version, (error) => {
		if (error) {
			return cb(error);
		}

		git.push('origin', 'master', { args: '--tags' }, cb);
	});
});

gulp.task('build-example-bundle', () => {
	return browserify([ './lib/index.js', './example/js/startup.js', ])
		.bundle()
		.pipe(source('example.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./example'));
});

gulp.task('build-test-bundle', () => {
	return browserify({ entries: glob.sync('test/specs/**/*.js') })
		.bundle()
		.pipe(source('SpecRunner.js'))
		.pipe(buffer())
		.pipe(gulp.dest('test'));
});

gulp.task('execute-browser-tests', () => {
	return gulp.src('test/SpecRunner.js')
		.pipe(jasmine());
});

gulp.task('execute-node-tests', () => {
	return gulp.src(['test/specs/**/*.js'])
		.pipe(jasmine());
});

gulp.task('execute-tests', gulp.series(
	'build-test-bundle',
	'execute-browser-tests',
	'execute-node-tests'
));

gulp.task('release', gulp.series(
	'ensure-clean-working-directory',
	'execute-tests',
	'document',
	'bump-version',
	'embed-version',
	'build-example-bundle',
	'commit-changes',
	'push-changes',
	'create-tag'
));

gulp.task('lint', () => {
	return gulp.src([ './**/*.js', './test/specs/**/*.js', '!./node_modules/**', '!./docs/**', '!./test/SpecRunner.js', '!./example/example.js' ])
		.pipe(jshint({'esversion': 6}))
		.pipe(jshint.reporter('default'));
});

gulp.task('test', gulp.series('execute-tests'));

gulp.task('default', gulp.series('lint'));