var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');
var browserSync = require('browser-sync');
var eslintify = require('eslintify');
var uglify = require('gulp-uglify');
var reload = browserSync.reload;

var clientConfig = {
    entryFile: './src/client.js',
    outputDir: './dist/',
    outputFile: 'client.js',
    presets: ['es2015'],
    uglify: false
};

var webConfig = {
    entryFile: './src/web.js',
    outputDir: './dist/',
    outputFile: 'web.js',
    presets: ['es2015'],
    uglify: true
}

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(clientConfig.outputDir, cb);
});

var clientBundler;
function getClientBundler() {
  if (!clientBundler) {
      clientBundler = watchify(browserify(clientConfig.entryFile, _.extend({ debug: true, builtins: false, commondir: false, browserField: false, bundleExternal: false }, watchify.args)));
  }
  return clientBundler;
};


var webBundler;
function getWebBundler() {
    if(!webBundler) {
        webBundler = watchify(browserify(webConfig.entryFile, _.extend({ debug: true }, watchify.args)));
    }
    return webBundler;
}

function bundle(bundler, config) {
    var pipeline = bundler
        .transform(eslintify)
        .transform(babelify, {presets: config.presets})
        .bundle()
        .on('error', function(err) {
            console.log('Error: ' + err.message);
            process.exit(1);
        })
        .pipe(source(config.outputFile));

    if (config.uglify) {
    pipeline = pipeline
        .pipe(buffer())
        .pipe(uglify());
    }

    pipeline = pipeline
        .pipe(gulp.dest(config.outputDir))
        .pipe(reload({ stream: true }));
    return pipeline;
}

gulp.task('client', [], function() {
    return bundle(getClientBundler(), clientConfig);
});

gulp.task('web', [], function() {
    return bundle(getWebBundler(), webConfig);
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

  getClientBundler().on('update', function() {
    gulp.start('client')
  });

  getWebBundler().on('update', function() {
    gulp.start('web')
  });
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
