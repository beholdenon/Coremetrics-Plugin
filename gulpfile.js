var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var htmlbeautify = require('gulp-html-beautify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var concat = require('gulp-concat');
var nunjucksRender = require('gulp-nunjucks-render');

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
  gulp.watch('src/**/*.nunjucks', ['templates']);
  gulp.watch('src/js/*.js', ['scripts']);
});

gulp.task('images', function() {
	gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});
gulp.task('clean', function () {
  return del([
    'dist/**/*'
  ]);
});
 
gulp.task('scripts', function() {
  return gulp.src(['./src/js/coremetrics_plugin.js', './src/js/main.js'])
    .pipe(concat('app.js'))
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

gulp.task('templates', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('dist'))
  .pipe(reload({ stream:true }));
});

gulp.task('default', ['sass', 'html', 'scripts', 'data', 'images', 'serve']);