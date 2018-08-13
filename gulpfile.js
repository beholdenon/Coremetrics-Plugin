var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var htmlbeautify = require('gulp-html-beautify');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var minify = require('gulp-minify');

gulp.task('sass', function() {
  return sass('src/sass/*.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({ stream:true }));
});

gulp.task('html', function() {
  var options = {
    indentSize: 2
  };
  gulp.src('./src/html/**/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./dist/'))
    .pipe(reload({ stream:true }));
});

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/html/*.html', ['html']);
  gulp.watch('src/js/*.js', ['scripts', 'compress']);
});

gulp.task('images', function() {
  gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});
gulp.task('compress', function() {
  gulp.src(['./src/js/*.js'])
    .pipe(minify())
    .pipe(gulp.dest('./dist/js/'))
});
gulp.task('scripts', function() {
  return gulp.src(['./src/js/bl.utils.js', './src/js/coremetrics_plugin.js'])
    .pipe(gulp.dest('./dist/js/'))
    .pipe(reload({ stream:true }));
});

gulp.task('data', function() {
  return gulp.src(['./src/data/**/*'])
    .pipe(gulp.dest('./dist/data/'));
});
gulp.task('fonts', function() {
  return gulp.src(['./src/fonts/**/*'])
    .pipe(gulp.dest('./dist/fonts/'));
});



gulp.task('default', ['sass', 'html', 'scripts', 'compress', 'data', 'images', 'serve']);