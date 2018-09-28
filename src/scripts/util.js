/**
 * @param byteArray Uint8Array
 * @returns {*}
 */
function byteToHex(byteArray) {
  return byteArray.reduce((output, elem) => (output + (`0${elem.toString(16)}`).slice(-2)), '');
}

/**
 * @param str string
 * @returns {Uint8Array}
 */
function hexToByte(str) {
  if (!str) {
    return new Uint8Array(0);
  }

  const a = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(a);
}

/**
 * @param str string
 * @returns {string}
 */
function sanitizeHex(str) {
  return str.replace(/^0x/, '').toUpperCase();
}

module.exports = { byteToHex, hexToByte, sanitizeHex };
