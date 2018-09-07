const del = require('del');
const gulp = require('gulp');

const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// Bundles js scripts
gulp.task('bundle-js', () => {
    return gulp.src('.')
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('./dist/scripts'));
});

// Deletes dist folder
gulp.task('clean', function clean() {
    return del(['./dist/**']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

// Copies static assets (all files except js scripts, which are bundled)
gulp.task('copy-assets', function copyAssets() {
    return gulp.src([
        './src/**/*',
        '!./src/scripts/*.js',
    ]).pipe(gulp.dest('./dist'));
});

// Creates distribution resources
gulp.task('dist',
    gulp.series(
        'clean',
        'copy-assets',
        'bundle-js'
    )
);