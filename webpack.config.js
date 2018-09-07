module.exports = {
    entry: {
        'ads-sign': './src/scripts/ads-sign.js',
        'background': './src/scripts/background.js',
        'popup': './src/scripts/popup.js',
        'proxy': './src/scripts/proxy.js'
    },
    mode: 'production',
    output: {
        filename: '[name].js',
        path: __dirname
    }
};
