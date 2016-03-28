'use strict';

var appName = 'HKElementMall';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var beep = require('beepbeep');
var express = require('express');
var mock = require('./mock');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var protractor = require("gulp-protractor").protractor;
var ripple = require('ripple-emulator');
/**
 * Parse arguments
 */
var args = require('yargs')
  .alias('e', 'emulate')
  .alias('b', 'build')
  .alias('r', 'run')
  // remove all debug messages (console.logs, alerts etc) from release build
  .alias('release', 'strip-debug')
  .default('build', false)
  .default('port', 4000)
  .default('strip-debug', false)
  .argv;

var build = !!(args.build || args.emulate || args.run);
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var stripDebug = !!args.stripDebug;
var targetDir = path.resolve(build ? 'www' : 'dev');

// if we just use emualate or run without specifying platform, we assume iOS
// in this case the value returned from yargs would just be true
if (emulate === true) {
  emulate = 'ios';
}
if (run === true) {
  run = 'ios';
}

// global error handler
var errorHandler = function (error) {
  if (build) {
    throw error;
  } else {
    beep(2, 170);
    plugins.util.log(error);
  }
};

// clean target dir
gulp.task('clean', function (done) {
  del([targetDir], done);
});

// precompile .scss and concat with ionic.css
gulp.task('styles', function () {

  var options = build ? { style: 'compressed' } : { style: 'expanded' };

  var sassStream = gulp.src('app/styles/main.scss')
    .pipe(plugins.sass(options))
    .on('error', function (err) {
      console.log('err: ', err);
      beep();
    });

  return streamqueue({ objectMode: true }, sassStream)
    .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
    .pipe(plugins.concat('main.css'))
    .pipe(plugins.if(build, plugins.stripCssComments()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))
    .pipe(gulp.dest(path.join(targetDir, 'styles')))
    .on('error', errorHandler);
});

gulp.task('common-styles', function () {
  var options = build ? { style: 'compressed' } : { style: 'expanded' };
  // build ionic css dynamically to support custom themes
  var ionicStream = gulp.src('app/commons/styles/main.scss')
    .pipe(plugins.cached('commons'))
    .pipe(plugins.sass(options))
    // cache and remember ionic .scss in order to cut down re-compile time
    .pipe(plugins.remember('commons'))
    .on('error', function (err) {
      console.log('err: ', err);
      beep();
    });
  return streamqueue({ objectMode: true }, ionicStream)
    .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
    .pipe(plugins.concat('commons.css'))
    .pipe(plugins.if(build, plugins.stripCssComments()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))
    .pipe(gulp.dest(path.join(targetDir, 'commons/styles')))
    .on('error', errorHandler);
});

// build templatecache, copy scripts.
// if build: concat, minsafe, uglify and versionize
gulp.task('scripts', function () {
  var dest = path.join(targetDir, 'scripts');

  var minifyConfig = {
    collapseWhitespace       : true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes    : true,
    removeComments           : true
  };

  // prepare angular template cache from html templates
  // (remember to change appName var to desired module name)
  var templateStream = gulp
    .src('**/*.html', { cwd: 'app/templates'})
    .pipe(plugins.angularTemplatecache('templates.js', {
      root   : 'templates/',
      module : appName,
      htmlmin: build && minifyConfig
    }));

  var scriptStream = gulp
    .src(['templates.js', 'app.js', '**/*.js'], { cwd: 'app/scripts' })

    .pipe(plugins.if(!build, plugins.changed(dest)));

  return streamqueue({ objectMode: true }, scriptStream, templateStream)
    .pipe(plugins.if(build, plugins.ngAnnotate()))
    .pipe(plugins.if(stripDebug, plugins.stripDebug()))
    .pipe(plugins.if(build, plugins.concat('app.js')))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))

    .pipe(gulp.dest(dest))

    .on('error', errorHandler);
});

gulp.task('common-scripts', function () {
  var dest = path.join(targetDir, '/commons/scripts/');
  var minifyConfig = {
    collapseWhitespace       : true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes    : true,
    removeComments           : true
  };
  var scriptStream = gulp
    .src(['**/*.js'], { cwd: 'app/commons' })
    .pipe(plugins.if(!build, plugins.changed(dest)));

  return streamqueue({ objectMode: true }, scriptStream)
    .pipe(plugins.if(build, plugins.ngAnnotate()))
    .pipe(plugins.if(stripDebug, plugins.stripDebug()))
    .pipe(plugins.concat('commons.js'))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))

    .pipe(gulp.dest(dest))

    .on('error', errorHandler);

});

// copy fonts
gulp.task('fonts', function () {
  return gulp
    .src(['app/commons/fonts/*.*', 'bower_components/ionic/release/fonts/*.*'])

    .pipe(gulp.dest(path.join(targetDir, 'commons/fonts')))

    .on('error', errorHandler);
});

// copy templates
gulp.task('templates', function () {
  return gulp.src('app/templates/**/*.*')
    .pipe(gulp.dest(path.join(targetDir, 'templates')))

    .on('error', errorHandler);
});

// copy images
gulp.task('images', function () {
  return gulp.src('app/images/**/*.*')
    .pipe(gulp.dest(path.join(targetDir, 'images')))

    .on('error', errorHandler);
});

// lint js sources based on .jshintrc ruleset
gulp.task('jsHint', function (done) {
  return gulp
    .src('app/scripts/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))

    .on('error', errorHandler);
  done();
});

// concatenate and minify vendor sources
gulp.task('vendor', function () {
  var vendorFiles = require('./vendor.json');

  return gulp.src(vendorFiles)
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build, plugins.rev()))

    .pipe(gulp.dest(targetDir))

    .on('error', errorHandler);
});

// inject the files in index.html
gulp.task('index', ['jsHint', 'scripts'], function () {

  // injects 'src' into index.html at position 'tag'
  var _inject = function (src, tag) {
    return plugins.inject(src, {
      starttag    : '<!-- inject:' + tag + ':{{ext}} -->',
      read        : false,
      addRootSlash: false
    });
  };

  // get all our javascript sources
  // in development mode, it's better to add each file seperately.
  // it makes debugging easier.
  var _getAllScriptSources = function () {
    var scriptStream = gulp.src(['scripts/app.js', 'scripts/**/*.js'], { cwd: targetDir });
    return streamqueue({ objectMode: true }, scriptStream);
  };

  return gulp.src('app/index.html')
    // inject css
    .pipe(_inject(gulp.src('styles/main*.css', { cwd: targetDir }), 'main'))
    .pipe(_inject(gulp.src('commons/styles/commons*.css', { cwd: targetDir }), 'commons'))
    // inject vendor.js
    .pipe(_inject(gulp.src('vendor*.js', { cwd: targetDir }), 'vendor'))
    .pipe(_inject(gulp.src('commons/scripts/commons*.js', { cwd: targetDir }), 'commons'))
    .pipe(plugins.if(build,
      _inject(gulp.src('scripts/app*.js', { cwd: targetDir }), 'app'),
      _inject(_getAllScriptSources(), 'app')
    ))

    .pipe(gulp.dest(targetDir))
    .on('error', errorHandler);
});

// start local express server
gulp.task('serve', function () {
  var app = express();
  app.use(!build ? connectLr() : function () {
  });
  app.use(express.static(targetDir));
  //mock.serv(app);
  app.listen(port);
  open('http://localhost:' + port + '/');
});

// ionic emulate wrapper
gulp.task('ionic:emulate', plugins.shell.task([
    'ionic run ios android --livereload --consolelogs'
]));

// ionic run wrapper
gulp.task('ionic:run', plugins.shell.task([
    'ionic run ' + run
]));
// ionic run wrapper
gulp.task('ionic:build', plugins.shell.task([
    'ionic build ' + build
]));

// ionic resources wrapper
gulp.task('icon', plugins.shell.task([
  'ionic resources --icon'
]));
gulp.task('splash', plugins.shell.task([
  'ionic resources --splash'
]));
gulp.task('resources', plugins.shell.task([
  'ionic resources'
]));

// select emulator device
gulp.task('select', plugins.shell.task([
  './helpers/emulateios'
]));

// ripple emulator
gulp.task('ripple', ['scripts', 'styles', 'watchers'], function () {

  var options = {
    keepAlive: false,
    open     : true,
    port     : 4400
  };

  // Start the ripple server
  ripple.emulate.start(options);

  open('http://localhost:' + options.port + '?enableripple=true');
});

// start watchers
gulp.task('watchers', function () {
  plugins.livereload.listen();
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/commons/styles/**/*.scss', ['common-styles']);
  gulp.watch('app/commons/fonts/**', ['fonts']);
  gulp.watch('app/images/**', ['images']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/commons/scripts/**/*.js', ['common-scripts']);
  gulp.watch('./vendor.json', ['vendor', 'index']);
  gulp.watch('app/templates/**/*.html', ['index']);
  gulp.watch('app/index.html', ['index']);
  gulp.watch(targetDir + '/**')
    .on('change', plugins.livereload.changed)
    .on('error', errorHandler);
});

gulp.task('webdriver-install', function (done) {
  var child_process = require('child_process');

  function getProtractorBinary(binaryName) {
    var winExt = /^win/.test(process.platform) ? '.cmd' : '';
    var pkgPath = require.resolve('protractor');
    var protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));
    return path.join(protractorDir, '/' + binaryName + winExt);
  }

  child_process.spawn(getProtractorBinary('webdriver-manager'), ['update'], {
    stdio: 'inherit'
  }).once('close', done);
});

gulp.task('test', function () {
  gulp.src(["./test/specs/*.js"])
    .pipe(protractor({
      configFile: "test/conf.js",
      args      : ['--baseUrl', 'http://localhost:4000']
    }))
    .on('error', function (e) {
      throw e
    })
});
// no-op = empty function
gulp.task('noop', function () {
});

// our main sequence, with some conditional jobs depending on params
gulp.task('default', function (done) {
  runSequence(
    'clean',
    [
      'fonts',
      'templates',
      'scripts',
      'styles',
      'images',
      'vendor',
      'common-scripts',
      'common-styles'
    ],
    'index',
    build ? 'noop' : 'watchers',
    build ? 'noop' : 'serve',
    emulate ? ['ionic:emulate', 'watchers'] : 'noop',
    run ? 'ionic:run' : 'noop',
    done);
});
