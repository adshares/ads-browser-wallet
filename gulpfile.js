const { exec } = require('child_process');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');

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

/**
 * Checks if file exists.
 * @param file
 * @returns {Promise<any>}
 */
async function doesFileExist(file) {
  return new Promise(resolve => fs.access(file, fs.constants.F_OK, err => resolve(err === null)));
}

/**
 * Bundles js files
 */
gulp.task('bundle-js', createBundleJsTask({}));

/**
 * Bundles js files without minification
 */
gulp.task('bundle-js:dev', createBundleJsTask({
  devMode: true,
}));

/**
 * Deletes dist folder
 */
gulp.task('clean',
  () => del(['./dist/**', './dist.crx'])
    .then((paths) => {
      if (paths && paths.length > 0) {
        log('Deleted files and folders:\n', paths.join('\n '));
      } else {
        log('No files to remove');
      }
    }));

/**
 * Copies static assets (all files except js scripts, which are bundled)
 */
gulp.task('copy-assets',
  () => gulp.src([
    './src/**/*',
    '!./src/scripts/*.js',
  ])
    .pipe(gulp.dest('./dist')));

/**
 * Packs distribution resources into plugin binary
 */
gulp.task('pack', async (cb) => {
  const path = `${__dirname}/dist`;
  let command = `google-chrome --pack-extension="${path}"`;

  const keyFile = `${__dirname}/dist.pem`;
  const isKeyFileAvailable = await doesFileExist(keyFile);
  if ((isKeyFileAvailable)) {
    command = `${command} --pack-extension-key="${keyFile}"`;
  }

  exec(command, (err) => {
    /**
     * Error object, which will be returned in task callback.
     * If no error occures it should be undefined, which means task success.
     */
    let cbError;
    if (err) {
      const message = '\'google-chrome\' is not recognized as an internal or external command,\n'
        + 'operable program or batch file.\n\n'
        + 'SOLUTION:\n'
        + 'For Linux: install google-chrome OR create alias google-chrome for chromium.\n'
        + 'For Windows: create alias for chrome.exe.\n'
        + '  1. create google-chrome.bat file:\n'
        + '    ```\n'
        + '    @echo off\n'
        + '    echo.\n'
        + '    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" %*\n'
        + '    ```\n'
        + '  2. change path to chrome.exe if needed.\n'
        + '  3. add google-chrome.bat file to PATH.\n\n'
        + 'Error';
      cbError = new Error(message);
    }
    cb(cbError);
  });
});

/**
 * Creates distribution resources without minification
 */
gulp.task('dist:dev',
  gulp.series(
    'clean',
    'copy-assets',
    'bundle-js:dev',
  ));

/**
 * Creates distribution resources
 */
gulp.task('dist',
  gulp.series(
    'clean',
    'copy-assets',
    'bundle-js',
  ));

/**
 * Creates plugin
 */
gulp.task('bin',
  gulp.series(
    'dist',
    'pack',
  ));
