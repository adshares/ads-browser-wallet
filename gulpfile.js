const del = require('del');
const gulp = require('gulp');

const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

/**
 * Creates task which bundles js scripts.
 *
 * @param devMode if true, scripts are minified
 * @returns {function(): NodeJS.ReadWriteStream}
 */
function createBundleJsTask({ devMode = false }) {
  return () => {
    const config = webpackConfig;
    if (devMode) {
      config.devtool = 'cheap-module-source-map';
      config.mode = 'development';
    }
    return gulp.src('.')
      .pipe(webpackStream(config))
      .pipe(gulp.dest('./dist/scripts'));
  };
}

gulp.task('bundle-js', createBundleJsTask({}));

gulp.task('bundle-js:dev', createBundleJsTask({
  devMode: true,
}));


// Deletes dist folder
gulp.task('clean',
  () => del(['./dist/**'])
    .then((paths) => {
      console.log('Deleted files and folders:\n', paths.join('\n'));
    }));

// Copies static assets (all files except js scripts, which are bundled)
gulp.task('copy-assets',
  () => gulp.src([
    './src/**/*',
    '!./src/scripts/*.js',
  ])
    .pipe(gulp.dest('./dist')));

// Creates distribution resources without minify
gulp.task('dist:dev',
  gulp.series(
    'clean',
    'copy-assets',
    'bundle-js:dev',
  ));

// Creates distribution resources
gulp.task('dist',
  gulp.series(
    'clean',
    'copy-assets',
    'bundle-js',
  ));
