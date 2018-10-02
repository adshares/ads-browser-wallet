const nacl = require('tweetnacl');
const sha256 = require('crypto-js/sha256');
const { byteToHex, hexToByte, sanitizeHex } = require('./util');

/**
 * Returns public key derived from secret key.
 *
 * @param secretKey secret key
 * @returns public key
 */
function getPublicKey(secretKey) {
  return byteToHex(nacl.sign.keyPair.fromSeed(hexToByte(secretKey)).publicKey)
    .toUpperCase();
}

/**
 * Returns secret key generated with seed.
 *
 * @param seed
 * @returns secret key
 */
function getSecretKey(seed) {
  return sha256(seed)
    .toString()
    .toUpperCase();
}

/**
 * Signs data with secret key.
 *
 * @param data data; in case of transaction: `tx.account_hashin` + `tx.data`
 * @param secretKey secret key 64 bytes: concatenation of secret and public key
 * @returns {string} signature 64 bytes
 */
function sign(data, secretKey) {
  return byteToHex(nacl.sign.detached(
    hexToByte(sanitizeHex(data)),
    hexToByte(sanitizeHex(secretKey)),
  ))
    .toUpperCase();
}

module.exports = {
  getPublicKey,
  getSecretKey,
  sign,
};
