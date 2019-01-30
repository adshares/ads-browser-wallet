/* eslint-disable no-plusplus */

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
  const val = value instanceof Date ? value : new Date(value);

  let year;
  let month;
  let day;
  let hours;
  let minutes;
  let seconds;

  if (utc) {
    year = val.getUTCFullYear();
    month = val.getUTCMonth() + 1;
    day = val.getUTCDate();
    hours = val.getUTCHours();
    minutes = val.getUTCMinutes();
    seconds = val.getUTCSeconds();
  } else {
    year = val.getFullYear();
    month = val.getMonth() + 1;
    day = val.getDate();
    hours = val.getHours();
    minutes = val.getMinutes();
    seconds = val.getSeconds();
  }

  year = year.toString().padStart(4, '0');
  month = month.toString().padStart(2, '0');
  day = day.toString().padStart(2, '0');
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  const date = `${year}-${month}-${day}`;
  const time = `${hours}:${minutes}:${seconds}`;

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


/**
 * Opens passed url in the new tab
 *
 *  @param url {string}
 *  @return {void}
 */

export function openInTheNewTab(url) {
  chrome.tabs.create({ url: chrome.runtime.getURL(url) });
}
