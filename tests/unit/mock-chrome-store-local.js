const ChromeStorage = {};
ChromeStorage.data = {};
ChromeStorage.get = (key, cb) => {
  const resp = {};
  if (Object.prototype.hasOwnProperty.call(ChromeStorage.data, key)) {
    resp[`${key}`] = ChromeStorage.data[`${key}`];
  }
  cb(resp);
};
ChromeStorage.set = (data, cb) => {
  Object.entries(data)
    .forEach(([key, value]) => {
      ChromeStorage.data[`${key}`] = value;
    });
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

module.exports = { ChromeStorage };
