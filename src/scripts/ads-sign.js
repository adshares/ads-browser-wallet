'use strict';

const nacl = require('tweetnacl');
const sha256 = require('crypto-js/sha256');

String.prototype.sanitizeHex = function () {
  return this.replace(/^0x/, '').toUpperCase();
};

String.prototype.hexToByte = function () {

  if (!this) {
    return new Uint8Array(0);
  }

  let a = [];
  for (let i = 0, len = this.length; i < len; i += 2) {
    a.push(parseInt(this.substr(i, 2), 16));
  }

  return new Uint8Array(a);
};

Uint8Array.prototype.byteToHex = function toHexStringReduce() {
  return this.reduce((output, elem) => (output + ('0' + elem.toString(16)).slice(-2)), '');
};

/**
 * Signs data with secret key.
 *
 * @param data data; in case of transaction: `tx.account_hashin` + `tx.data`
 * @param secretKey secret key 64 bytes: concatenation of secret and public key
 * @returns {string} signature 64 bytes
 */
function sign(data, secretKey) {
  return nacl.sign.detached(
    data.sanitizeHex().hexToByte(),
    secretKey.sanitizeHex().hexToByte()
  ).byteToHex().toUpperCase();
}

/**
 * Returns secret key generated with seed.
 *
 * @param seed
 * @returns secret key
 */
function getSecretKey(seed) {
  return sha256(seed).toString().toUpperCase();
}

/**
 * Returns public key derived from secret key.
 *
 * @param secretKey secret key
 * @returns public key
 */
function getPublicKey(secretKey) {
  return nacl.sign.keyPair.fromSeed(secretKey.hexToByte()).publicKey.byteToHex().toUpperCase();
}

module.exports = {sign, getSecretKey, getPublicKey};
