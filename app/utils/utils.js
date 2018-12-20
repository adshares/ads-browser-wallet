/**
 * @param byteArray Uint8Array
 * @returns {*}
 */
export function byteToHex(byteArray) {
  // parseInt is needed for eliminating invalid number of arguments warning for toString function
  return byteArray.reduce(
    (output, elem) => (output + (`0${parseInt(elem, 10).toString(16)}`).slice(-2)),
    '',
  );
}

/**
 * @param str string
 * @returns {Uint8Array}
 */
export function hexToByte(str) {
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
export function sanitizeHex(str) {
  return str.replace(/^0x/, '').toUpperCase();
}

/**
 * Changes hex string from little-endian to big-endian.
 *
 * @param {string} data
 * @returns {string | *}
 */
export function fixByteOrder(data) {
  // match - splits string to array of 2 characters
  // reverse - changes order of chunks
  // join - combines chunks to string
  return data.match(/.{1,2}/g)
    .reverse()
    .join('');
}

export function searchForExistingKey(newKey, keys, type) {
  keys.find(key => key.type === newKey.type);
}

export function formatMoney(amount, precision = 4, decimal = '.', thousand = ',') {
  return (amount || 0).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, `$&${thousand}`);
}
