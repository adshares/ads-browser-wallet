import NaCl from 'js-nacl';
import { byteToHex, hexToByte, sanitizeHex } from './utils';

/**
 * Calculates CRC16 checksum.
 *
 * @param data a input data
 * @returns {string} checksum (4 hexadecimal characters)
 */
function crc16(data) {
  const d = hexToByte(sanitizeHex(data));

  /*eslint no-bitwise: ["error", { "allow": ["^", "^=", "&", ">>", "<<"] }] */
  let crc = 0x1d0f;
  for (const b of d) {
    let x = (crc >> 8) ^ b;
    x ^= x >> 4;
    crc = ((crc << 8) ^ ((x << 12)) ^ ((x << 5)) ^ (x)) & 0xFFFF;
  }

  const result = `0000${crc.toString(16)}`;
  return result.substr(result.length - 4);
}

/**
 * Calculates a ADS account address checksum.
 *
 * @param nodeId the node id (4 hexadecimal characters)
 * @param userAccountId the id of the user account (8 hexadecimal characters)
 * @returns {string} the account address checksum (4 hexadecimal characters)
 */
function addressChecksum(nodeId, userAccountId) {
  return sanitizeHex(crc16(`${nodeId}${userAccountId}`));
}

/**
 * Checks if ADS account address is valid.
 *
 * @param address e.g. 0001-00000001-8B4E
 * @returns {boolean}
 */
function validateAddress(address) {
  if (!address) {
    return false;
  }

  const addressRegexp = /^([0-9a-fA-F]{4})-([0-9a-fA-F]{8})-([0-9a-fA-F]{4})$/;
  const matches = addressRegexp.exec(address);

  if (!matches || matches.length !== 4) {
    return false;
  }

  return sanitizeHex(matches[3]) === addressChecksum(matches[1], matches[2]);
}

/**
 * Checks if ADS public or private key is valid.
 *
 * @param key e.g. BE907B4BAC84FEE5CE8811DB2DEFC9BF0B2A2A2BBC3D54D8A2257ECD70441962
 * @returns {boolean}
 */
function validateKey(key) {
  if (!key) {
    return false;
  }

  const keyRegexp = /^[0-9a-fA-F]{64}$/;
  return keyRegexp.test(key);
}

/**
 * Signs data with a secret key.
 *
 * @param data data; in case of transaction: `tx.account_hashin` + `tx.data`
 * @param secretKey secret key 64 bytes: concatenation of secret and public key
 * @returns {string} signature 64 bytes
 */

function sign(data, secretKey) {
  return byteToHex(NaCl.crypto_sign_detached(
    hexToByte(sanitizeHex(data)),
    hexToByte(sanitizeHex(secretKey)),
  )).toUpperCase();
}

/**
 * Validate signature
 *
 * @param sg (signature )e.g. ?
 * @param pk (public key) e.g. BE907B4BAC84FEE5CE8811DB2DEFC9BF0B2A2A2BBC3D54D8A2257ECD70441962
 * @param sk (secret key) e.g. BE907B4BAC84FEE5CE8811DB2DEFC9BF0B2A2A2BBC3D54D8A2257ECD70441962

 * @returns {boolean}
 */

function validateSignature(sg, pk, sk) {
  try {
    const signed = sign('', sk + pk);
    return (signed === sg);
  } catch (err) {
    return false;
  }
}

export default {
  addressChecksum,
  validateAddress,
  validateKey,
  validateSignature,
  sign,
};
