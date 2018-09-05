module.exports = {
    entry: {
        'ads-sign': './src/scripts/ads-sign.js'
    },
    mode: 'production',
    output: {
        filename: '[name].js',
        path: __dirname + 'dist'
    }
};
