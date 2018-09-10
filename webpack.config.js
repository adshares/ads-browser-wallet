module.exports = {
    entry: {
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
