import * as KeyBox from './keybox';

/**
 * @param byteArray Uint8Array
 * @returns {*}
 */
export function byteToHex(byteArray) {
  // parseInt is needed for eliminating invalid number of arguments warning for toString function
  return byteArray.reduce(
    (output, elem) => (output + (`0${parseInt(elem, 10)
      .toString(16)}`).slice(-2)),
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
 * @param str
 * @returns {string}
 */
export function stringToHex(str) {
  const result = [];
  let hex;
  for (let i = 0; i < str.length; i++) {
    hex = Number(str.charCodeAt(i))
      .toString(16)
      .padStart(2, '0');
    result.push(hex);
  }

  return result.join('');
}

/**
 * @param str string
 * @returns {string}
 */
export function sanitizeHex(str) {
  return str.replace(/^0x/, '')
    .toUpperCase();
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

/**
 * Format date YYYY-MM-DDDD HH:MM:SS
 *
 * @param value date to format
 * @param showTime foramt with time
 * @param utc in UTC or local timezone
 * @returns {string}
 */
export function formatDate(value, showTime = true, utc = false) {
  let date;
  let time;
  const val = value instanceof Date ? value : new Date(value);
  if (utc) {
    date = `${val.getUTCFullYear()}-${(val.getUTCMonth() + 1).toString()
      .padStart(2, '0')}-${val.getUTCDate()
      .toString()
      .padStart(2, '0')}`;
    time = `${val.getUTCHours()
      .toString()
      .padStart(2, '0')}:${val.getUTCMinutes()
      .toString()
      .padStart(2, '0')}:${val.getUTCSeconds()
      .toString()
      .padStart(2, '0')}`;
  } else {
    date = `${val.getFullYear()}-${(val.getMonth() + 1).toString()
      .padStart(2, '0')}-${val.getDate()
      .toString()
      .padStart(2, '0')}`;
    time = `${val.getHours()
      .toString()
      .padStart(2, '0')}:${val.getMinutes()
      .toString()
      .padStart(2, '0')}:${val.getSeconds()
      .toString()
      .padStart(2, '0')}`;
  }
  return `${date}${showTime ? ` ${time}` : ''}${utc ? ' UTC' : ''}`;
}

/**
 * Generate pseudo UUID v4.
 *
 * @returns {string}
 */
export function uuidv4() {
  /*eslint no-bitwise: ["error", { "allow": ["|", "&" ] }]*/
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

export function findAccountByAddressInVault(vault, address) {
  return vault.accounts.find(a => a.address === address);
}

export function findIfPublicKeyExist(vault, publicKey) {
  return vault.keys.find(k =>
    k.publicKey ? k.publicKey === publicKey
      : KeyBox.getPublicKeyFromSecret(k.secretKey) === publicKey
  );
}

export function findAccountByNameInVault(vault, name) {
  return vault.accounts.find(a => a.name === name);
}

/**
 * Copy passed text to clipboard. Works only with user events like e.g. click,
 * due to the way Document.execCommand() works.
 *
 *  @param str {string}
 *  @return {void}
 */

export function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
