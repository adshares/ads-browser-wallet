const del = require('del');
const gulp = require('gulp');

// const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// Packs js scripts
gulp.task('bundle-js', () => {
    return gulp.src('./src/scripts/ads-sign.js')
        // .pipe(webpackStream(webpackConfig), webpack)
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('./dist'));
});

// Deletes dist folder
gulp.task('clean', function clean () {
    return del(['./dist/**']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});