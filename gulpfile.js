// Gulp Dependencies
var gulp = require('gulp');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var path = require('path');

// Build Dependencies
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// HTML Dependencies
var jade = require('gulp-jade');

// Style Dependencies
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependencies
var jshint = require('gulp-jshint');

// Javascript building tasks
gulp.task('lint-client', function() {
  return gulp.src('./lib/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('browserify-client', ['lint-client'], function() {
  return gulp.src('lib/tribe.js')
    .pipe(browserify({
      insertGlobals: true,
      shim: {
        d3: {
          path: path.join(__dirname, 'node_modules', 'd3', 'd3.js'),
          exports: 'd3'
        }
      }
    }))
    .pipe(rename('tribe.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('uglify', ['browserify-client'], function() {
  return gulp.src('build/tribe.js')
    .pipe(uglify())
    .pipe(rename('tribe.min.js'))
    .pipe(gulp.dest('public/scripts'));
});

// Style building tasks
gulp.task('styles', function() {
  return gulp.src('templates/stylesheets/tribe.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'node_modules', 'lesshat', 'build'),
               path.join(__dirname, 'node_modules', 'normalize.css') ]
    }))
    .pipe(prefix({ cascade: true }))
    .pipe(rename('tribe.css'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('minify', ['styles'], function() {
  return gulp.src('build/tribe.css')
    .pipe(minifyCSS())
    .pipe(rename('tribe.min.css'))
    .pipe(gulp.dest('public/stylesheets'));
});

// HTML Building tasks
gulp.task('html', function() {
  gulp.src('templates/html/index.jade')
    .pipe(jade({locals: {debug: true}}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('public/'))
});

// Task that copies the assets to the build directory.
gulp.task('copyassets', function() {
   gulp.src('assets/fonts/*')
   .pipe(gulp.dest('public/fonts'));
   gulp.src('assets/images/*')
   .pipe(gulp.dest('public/images'));
   gulp.src('assets/icons/*')
   .pipe(gulp.dest('public/icons'));
});

// Task to start a webserver.
gulp.task('webserver', function() {
  connect.server({
    root: 'public'
  });
});

// Tanks to build the entire site
gulp.task('build', ['uglify', 'minify', 'html']);

// Watch task
gulp.task('watch', function() {
  gulp.watch('lib/**/*.js', ['uglify']);
  gulp.watch('templates/html/**/*.jade', ['html']);
  gulp.watch('templates/stylesheets/**/*.less', ['minify']);
});

// Default build taskg
gulp.task('default', ['build', 'copyassets']);
gulp.task('devenv', ['build', 'copyassets', 'webserver', 'watch']);
