var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    fs = require('fs'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint')
    ;

var compass = require('gulp-compass'),
    path = require('path');

var skinDir = 'theme/skin/frontend/my-theme/default/';
var appDir = 'theme/app/design/frontend/my-theme/default/';

var paths = {
    scss: skinDir + 'scss',
    css:  skinDir + 'css',
    jssrc:  skinDir + 'js-src',
    js:  skinDir + 'js',
    imagessrc: skinDir + 'images-src/**/*.{png,jpg,gif}',
    images: skinDir + 'images'

};

var watched = {
    scss: paths.scss + '/**/*.scss'
};

var watchedFiles = [
    appDir + '**/*.{phtml,xml}',
	skinDir + 'scss/{,*/}*.scss',
	skinDir + 'images-src/{,*/}*.{png,jpg,gif}',
	skinDir + 'js/*.js',
    '!' + skinDir + 'js/*.min.js'
];

gulp.task('clean', function(cb) {
    del([paths.images], cb);
});

gulp.task('compass', function() {
    gulp.src(watched.scss)
    .pipe(compass({
        css: paths.css,
        sass: paths.scss,
        environment: 'development',
        outputStyle: 'nested'
    }))
    .pipe(gulp.dest(paths.css));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(watchedFiles, ['compass', 'imagemin', 'uglify']).on('change', livereload.changed);
});

gulp.task('imagemin', ['clean'], function() {
    gulp.src(paths.imagessrc)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(paths.images));
});

gulp.task('uglify', ['jshint'], function() {
    gulp.src(paths.jssrc + '/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(concat('scripts.min.js'))
            .pipe(uglify({
                mangle: false
            }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js));
});

gulp.task('jshint', function() {
    gulp.src([paths.jssrc + '/**/*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('default', ['compass', 'imagemin', 'uglify']);