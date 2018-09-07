'use strict';

const CryptoJS = require('crypto-js');

/**
 * Reads data from store.
 *
 * @param key data key
 * @returns {Promise}
 */
function getData(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
            } else {
                resolve(items[key]);
            }
        });
    });
}

/**
 * Reads data from store.
 *
 * @param key data key
 * @param pass password to decrypt data
 * @returns {Promise}
 */
function getEncryptedData(key, pass) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
            } else {
                const encrypted = items[key];
                if (!encrypted) {
                    resolve();
                } else {
                    // Encoder CryptoJS.enc.Utf8 below is needed to properly encode decrypted data
                    const decrypted = CryptoJS.AES.decrypt(encrypted, pass).toString(CryptoJS.enc.Utf8);
                    if (!decrypted) {
                        reject('Invalid pass');
                    } else {
                        resolve(JSON.parse(decrypted));
                    }
                }
            }
        });
    });
}

/**
 * Writes data in storage.
 *
 * @param key data key
 * @param data data
 * @returns {Promise}
 */
function setData(key, data) {
    let dataObject = {};
    dataObject[key] = data;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(dataObject, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Writes data in storage.
 *
 * @param key data key
 * @param data data
 * @param pass password to encrypt data
 * @returns {Promise}
 */
function setEncryptedData(key, data, pass) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), pass).toString();
    let dataObject = {};
    dataObject[key] = encrypted;
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(dataObject, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {getData, getEncryptedData, setData, setEncryptedData};
