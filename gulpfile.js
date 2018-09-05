const del = require('del');
const gulp = require('gulp');

const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// Packs js scripts
gulp.task('bundle-js', () => {
    return gulp.src('.')
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('./dist'));
});

// Deletes dist folder
gulp.task('clean', function clean() {
    return del(['./dist/**']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});