//yarn add gulp gulp-watch gulp-uglify gulp-stylus gulp-sourcemaps gulp-rigger gulp-plumber gulp-clean-css gulp-concat rimraf gulp-autoprefixer browser-sync

'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	stylus = require('gulp-stylus'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	plumber = require('gulp-plumber'),
	cssMin = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	rimraf = require('rimraf'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/i/',
		fonts: 'dist/fonts/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/*.js',
		css: 'src/style/*.styl',
		img: 'src/i/**',
		fonts: 'src/fonts/**',
		cssLibs: 'src/style/libs/*.css',
		jsLibs: 'src/js/libs/*.js'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		css: 'src/style/**/*.styl',
		img: 'src/i/**',
		fonts: 'src/fonts/**',
		cssLibs: 'src/style/libs/**/*.css',
		jsLibs: 'src/js/libs/**/*.js'
	},
	clean: './dist'
};
gulp.task('browserSync', function(done) {
	browserSync.init({
		server: {
			baseDir: './dist'
		},
		tunnel: true,
		host: 'localhost',
		open: 'external',
		port: 3000,
		logPrefix: "server"
	});
	done();
});

gulp.task('html:build', function(done) {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('js:build', function(done) {
	gulp.src(path.src.js)
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('style:build', function(done) {
	gulp.src(path.src.css)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(stylus())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		// .pipe(cssMin({compatibility: 'ie8'}))
		.pipe(concat('main.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('cssLibs:build', function(done) {
	gulp.src(path.src.cssLibs)
		.pipe(sourcemaps.init())
		.pipe(concat('plugins.css'))
		// .pipe(cssMin({compatibility: 'ie8'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('jsLibs:build', function(done) {
	gulp.src(path.src.jsLibs)
		.pipe(sourcemaps.init())
		//.pipe(uglify())
		.pipe(concat('plugins.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('style-no-map:build', function(done) {
	gulp.src(path.src.css)
		.pipe(plumber())
		.pipe(stylus())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		//.pipe(cssMin({compatibility: 'ie8'}))
		.pipe(concat('main.css'))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('cssLibs-no-map:build', function(done) {
	gulp.src(path.src.cssLibs)
		.pipe(concat('plugins.css'))
		//.pipe(cssMin({compatibility: 'ie8'}))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('jsLibs-no-map:build', function(done) {
	gulp.src(path.src.jsLibs)
		//.pipe(uglify())
		.pipe(concat('plugins.js'))
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({ stream: true }));
	done();
});
gulp.task('fonts:build', function(done) {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
	done();
});
gulp.task('img:build', function(done) {
	gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img));
	done();
});
gulp.task('build', gulp.series('html:build', 'js:build', 'style:build', 'cssLibs:build', 'jsLibs:build', 'img:build', 'fonts:build', function(done) {
	done();
}));
gulp.task('build-final', gulp.series('html:build', 'js:build', 'style-no-map:build', 'cssLibs-no-map:build', 'jsLibs-no-map:build', 'img:build', 'fonts:build', function(done) {
	done();
}));
gulp.task('watch', function() {
	gulp.watch(path.watch.js, gulp.series('js:build'));
	gulp.watch(path.watch.html, gulp.series('html:build'));
	gulp.watch(path.watch.css, gulp.series('style:build'));
	gulp.watch(path.watch.img, gulp.series('img:build'));
	gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
	gulp.watch(path.watch.cssLibs, gulp.series('cssLibs:build'));
	gulp.watch(path.watch.jsLibs, gulp.series('jsLibs:build'));
});
gulp.task('clean', function(done) {
	del.sync(path.clean);
	done();
});
gulp.task('default', gulp.series('build', gulp.parallel('browserSync', 'watch')));
