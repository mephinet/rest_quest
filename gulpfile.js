var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require("gulp-babel");
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');
var browserSync = require('browser-sync');
var eslintify = require('eslintify');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var reload = browserSync.reload;


var clientConfig = {
    entryFile: ['./src/**/*.js'],
    outputDir: './build/',
    outputFile: 'client.js',
    presets: ['es2015', 'react']
};

var webConfig = {
    entryFile: './src/web.js',
    outputDir: './dist/',
    outputFile: 'web.js',
    presets: ['es2015', 'react']
}

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(clientConfig.outputDir, function () {
        rimraf(webConfig.outputDir, cb);
    });
});


var webBundler;
function getWebBundler() {
    if(!webBundler) {
        webBundler = watchify(browserify(webConfig.entryFile, _.extend({ debug: true }, watchify.args)));
    }
    return webBundler;
}

gulp.task('client', [], function() {
    return gulp.src(clientConfig.entryFile)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(babel({presets: clientConfig.presets, plugins: clientConfig.plugins}))
        .pipe(gulp.dest(clientConfig.outputDir));
});

gulp.task('web', [], function() {
    var bundler = getWebBundler();
    return bundler
        .transform(eslintify)
        .transform(babelify, {presets: webConfig.presets})
        .bundle()
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        .pipe(source(webConfig.outputFile))
        // .pipe(buffer())
        // .pipe(uglify())
        .pipe(gulp.dest(webConfig.outputDir))
        .pipe(reload({ stream: true }));
})

gulp.task('build', ['client', 'web'], function() {
  process.exit(0);
});

gulp.task('watch', ['client', 'web'], function() {

    browserSync({
        server: {
            baseDir: './'
        }
    });

    getWebBundler().on('update', function() {
        gulp.start('web')
    });

    gulp.watch(clientConfig.entryFile, ['client']);
});

// WEB SERVER
gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});
