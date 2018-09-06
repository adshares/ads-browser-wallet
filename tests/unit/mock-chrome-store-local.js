let ChromeStorage = {};
ChromeStorage.data = {};
ChromeStorage.get = function(key, cb) {
    let resp = {};
    if (ChromeStorage.data.hasOwnProperty(key)) {
        resp[''+key] = ChromeStorage.data[''+key];
    }
    cb(resp);
};
ChromeStorage.set = function(data, cb) {
    for (let key in data) {
        ChromeStorage.data[''+key] = data[''+key];
    }
    cb();
};
// Code below should be checked before use
// ChromeStorage.remove = function(key, cb) {
//     ChromeStorage.data.key = undefined;
//     cb();
// };
// ChromeStorage.clear = function(key, data, cb) {
//     ChromeStorage.data = {};
//     cb();
// };

module.exports = {ChromeStorage};
