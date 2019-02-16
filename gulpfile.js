// Gulp
// =======================================================
// Installation:
// $ npm install gulp -g
//
// Gulp Tutorials:
// - http://gulpjs.com
// - https://laracasts.com/lessons/gulp-this
// - http://markgoodyear.com/2014/01/getting-started-with-gulp
// =======================================================

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    connect      = require('gulp-connect'),
    zip          = require('gulp-zip'),
    del          = require('del');

$exec   = require('child_process').exec;

var paths_dir = {
  docs: 'docs',
  docsasset: 'assets',
  site: 'dev',
  templates : 'templates',
  dist: 'dist',
  sitejs: 'js',
  sitecss: 'css',
  sitesass: 'scss'
};

var paths = {
  docs: paths_dir.docs,
  docsasset: paths_dir.docs + '/' + paths_dir.docsasset,
  site: paths_dir.site,
  templates: paths_dir.site + '/' + paths_dir.templates,
  dist: paths_dir.dist,
  sitejs: paths_dir.site + '/' + paths_dir.sitejs,
  sitecss: paths_dir.site + '/' + paths_dir.sitecss,
  sitesass: paths_dir.site + '/' + paths_dir.sitesass
};


// ===================================================
// Styling
// ===================================================

gulp.task('sass', function() {
  var stream = gulp.src(paths.sitesass + '/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sitecss))
    .pipe(connect.reload());

  return stream;
});


// ===================================================
// Serving
// ===================================================

gulp.task('serve', function(done) {
  connect.server({
    root: [paths.site],
    port: 9001,
    livereload: true
  });

  $exec('open http://localhost:9001');

  done();
});


// ===================================================
// Watching
// ===================================================

gulp.task('watch', function(done) {
  gulp.watch(paths.sitesass + '/**/*.scss', gulp.task('sass'));

  done();
});


// ===================================================
// Cleaning
// ===================================================

gulp.task('cleandev', function(cb) {
  return del([
    'dev/scss/*.css',
    'dev/{css,scss}/*.css.map'
  ], cb);
});

gulp.task('cleandist', function(cb) {
  return del([
    'dist/scss/typeplate.scss',
    'dist/scss/*.css',
    'dist/scss/*.css.map'
  ], cb);
});


// ===================================================
// Copying
// ===================================================

gulp.task('copy', function(done) {
  gulp.src('dev/css/**')
    .pipe(gulp.dest('dist/css'));

  gulp.src('dev/scss/**')
    .pipe(gulp.dest('dist/scss'));

  gulp.src('{README,package,license}.{json,md,package,txt}')
    .pipe(gulp.dest('dist'));

  gulp.src('dev/*.{md,json}')
    .pipe(gulp.dest('dist'));

  done();
});


// ===================================================
// Packaging
// ===================================================

gulp.task('zipit', function() {
  return gulp.src('dev/scss/_**.scss')
    .pipe(zip('typeplate-sk.zip'))
    .pipe(gulp.dest('.'));
});


// ===================================================
// Tasking
// ===================================================

gulp.task('default', gulp.parallel('serve', 'watch'));
gulp.task('sweep', gulp.task('cleandev'));
gulp.task('build', gulp.task('copy'));
gulp.task('cleanse', gulp.task('cleandist'));
gulp.task('ship', gulp.task('zipit'));
