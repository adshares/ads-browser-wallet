'use strict';

const CryptoJS = require('crypto-js');

/**
 * Reads value from `localStorage`.
 *
 * @param key key
 * @param pass password to decrypt data
 * @returns {any} data
 *
 * @throws 'Invalid pass' when password cannot decrypt data
 * @throws 'No value matching key' when there is no data for given key
 */
function get(key, pass) {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
        throw 'No value matching key';
    }
    // Encoder CryptoJS.enc.Utf8 below is needed to properly encode decrypted data
    const decrypted = CryptoJS.AES.decrypt(encrypted, pass).toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
        throw 'Invalid pass';
    }

    return JSON.parse(decrypted);
}

/**
 * Writes value in `localStorage`.
 *
 * @param key key
 * @param value data
 * @param pass password to encrypt data
 */
function set(key, value, pass) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), pass).toString();
    localStorage.setItem(key, encrypted);
}

module.exports = {get, set};
