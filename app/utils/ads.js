import NaCl from 'tweetnacl';
import { byteToHex, hexToByte, sanitizeHex, fixByteOrder } from './utils';
import { TransactionDataError } from '../actions/errors';

/**
 * Response field names
 */
const TX_FIELDS = {
  /** address */
  ADDRESS: 'address',
  /** transaction amount */
  AMOUNT: 'amount',
  /** block id */
  BLOCK_ID: 'block_id',
  /** block id */
  BLOCK_ID_FROM: 'block_id_from',
  /** block id */
  BLOCK_ID_TO: 'block_id_to',
  /** message */
  MSG: 'message',
  /** message length */
  MSG_LEN: 'message_length',
  /** number of sender transactions */
  MSID: 'msid',
  /** node */
  NODE: 'node',
  /** number of node message */
  NODE_MSID: 'node_msid',
  /** public key */
  PUBLIC_KEY: 'public_key',
  /** sender address */
  SENDER: 'sender',
  /** account */
  STATUS_ACCOUNT: 'account_status',
  /** node status */
  STATUS_NODE: 'node_status',
  /** transaction time */
  TIME: 'time',
  /** transaction id */
  TX_ID: 'txid',
  /** transaction type */
  TYPE: 'type',
  /** vip hash */
  VIP_HASH: 'vip_hash',
  /** number of wires */
  WIRE_COUNT: 'wire_count',
  /** wires */
  WIRES: 'wires',
};

/**
 * Transaction types
 */
const TX_TYPES = {
  '03': 'broadcast',
  '04': 'send_one',
  '05': 'send_many',
  '06': 'create_account',
  '07': 'create_node',
  '08': 'retrieve_funds',
  '09': 'change_account_key',
  '0A': 'change_node_key',
  '0B': 'set_account_status',
  '0C': 'set_node_status',
  '0D': 'unset_account_status',
  '0E': 'unset_node_status',
  '0F': 'log_account',
  10: 'get_account',
  11: 'get_log',
  12: 'get_broadcast',
  13: 'get_blocks',
  14: 'get_transaction',
  15: 'get_vipkeys',
  16: 'get_signatures',
  17: 'get_block',
  18: 'get_accounts',
  19: 'get_message_list',
  '1A': 'get_message',
  '1B': 'get_fields',
};

/**
 * Calculates CRC16 checksum.
 *
 * @param data a input data
 * @returns {string} checksum (4 hexadecimal characters)
 */
function crc16(data) {
  const d = hexToByte(sanitizeHex(data));

  /*eslint no-bitwise: ["error", { "allow": ["^", "^=", "&", ">>", "<<"] }]*/
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
 *
 * @param nodeId node identifier
 * @param userAccountId user account identifier
 * @returns {string}
 */
function formatAddress(nodeId, userAccountId) {
  return `${sanitizeHex(nodeId)}-${sanitizeHex(userAccountId)}-${addressChecksum(nodeId, userAccountId)}`;
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
 * Checks if ADS public or secret key is valid.
 *
 * @param key (64 hexadecimal characters)
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
 * Returns public key derived from secret key.
 *
 * @param secretKey secret key (64 hexadecimal characters)
 * @returns {string} public key (64 hexadecimal characters)
 */
function getPublicKey(secretKey) {
  return byteToHex(
    NaCl.sign.keyPair.fromSeed(hexToByte(secretKey)).publicKey
  ).toUpperCase();
}

/**
 * Signs data with a secret key.
 *
 * @param data data; in case of transaction: `tx.account_hashin` + `tx.data`
 * @param publicKey public key 32 bytes
 * @param secretKey secret key 32 bytes
 * @returns {string} signature 64 bytes
 */
function sign(data, publicKey, secretKey) {
  return byteToHex(NaCl.sign.detached(
    hexToByte(sanitizeHex(data)),
    hexToByte(sanitizeHex(secretKey + publicKey)),
  )).toUpperCase();
}

/**
 * Validate empty string signature.
 *
 * @param signature (128 hexadecimal characters)
 * @param publicKey (64 hexadecimal characters)
 * @param secretKey (64 hexadecimal characters)
 * @returns {boolean}
 */
function validateSignature(signature, publicKey, secretKey) {
  try {
    return sign('', secretKey + publicKey) === signature;
  } catch (err) {
    return false;
  }
}

class Decoder {
  constructor(data) {
    this.data = data;
    this.resp = {};
  }

  decode(fieldName) {
    let parsed;
    switch (fieldName) {
      case TX_FIELDS.ADDRESS:
      case TX_FIELDS.SENDER: {
        this.validateLength(12);
        const node = fixByteOrder(this.data.substr(0, 4));
        const user = fixByteOrder(this.data.substr(4, 8));
        parsed = formatAddress(node, user);
        this.data = this.data.substr(12);
        break;
      }
      case TX_FIELDS.AMOUNT: {
        this.validateLength(16);
        parsed = fixByteOrder(this.data.substr(0, 16));
        // parsed = formatMoney(parseInt(parsed, 16) / 100000000000, 11);
        parsed = parseInt(parsed, 16);
        this.data = this.data.substr(16);
        break;
      }
      case TX_FIELDS.BLOCK_ID:
      case TX_FIELDS.BLOCK_ID_FROM:
      case TX_FIELDS.BLOCK_ID_TO: {
        this.validateLength(8);
        parsed = fixByteOrder(this.data.substr(0, 8));
        // parsed = new Date(parseInt(parsed, 16) * 1000);
        this.data = this.data.substr(8);
        break;
      }
      case TX_FIELDS.TIME: {
        this.validateLength(8);
        const time = fixByteOrder(this.data.substr(0, 8));
        parsed = new Date(parseInt(time, 16) * 1000);
        this.data = this.data.substr(8);
        break;
      }
      case TX_FIELDS.MSG: {
        const expectedLength = (this.resp[TX_FIELDS.TYPE] === 'send_one') ? 64 : this.resp[TX_FIELDS.MSG_LEN] * 2;
        this.validateLength(expectedLength);
        parsed = this.data;
        this.data = '';
        break;
      }
      case TX_FIELDS.MSG_LEN: {
        this.validateLength(4);
        parsed = fixByteOrder(this.data.substr(0, 4));
        parsed = parseInt(parsed, 16);
        this.data = this.data.substr(4);
        break;
      }
      case TX_FIELDS.MSID:
      case TX_FIELDS.NODE_MSID: {
        this.validateLength(8);
        parsed = fixByteOrder(this.data.substr(0, 8));
        parsed = parseInt(parsed, 16);
        this.data = this.data.substr(8);
        break;
      }
      case TX_FIELDS.NODE: {
        this.validateLength(4);
        parsed = fixByteOrder(this.data.substr(0, 4));
        this.data = this.data.substr(4);
        break;
      }
      case TX_FIELDS.PUBLIC_KEY:
      case TX_FIELDS.VIP_HASH: {
        this.validateLength(64);
        // intentional lack of reverse - key and hash are not reversed
        parsed = this.data.substr(0, 64);
        this.data = this.data.substr(64);
        break;
      }
      case TX_FIELDS.STATUS_ACCOUNT: {
        this.validateLength(4);
        parsed = fixByteOrder(this.data.substr(0, 4));
        parsed = parseInt(parsed, 16);
        this.data = this.data.substr(4);
        break;
      }
      case TX_FIELDS.STATUS_NODE: {
        this.validateLength(8);
        parsed = fixByteOrder(this.data.substr(0, 8));
        // node status has 32 bits
        // operation ' | 0' changes parsed type to int32
        /* eslint no-bitwise: ["error", { "int32Hint": true }] */
        parsed = parseInt(parsed, 16) | 0;
        this.data = this.data.substr(8);
        break;
      }
      case TX_FIELDS.TX_ID: {
        this.validateLength(16);
        const node = fixByteOrder(this.data.substr(0, 4));
        const msgId = fixByteOrder(this.data.substr(4, 8));
        const txOffset = fixByteOrder(this.data.substr(12, 4));
        parsed = `${node}:${msgId}:${txOffset}`;
        this.data = this.data.substr(16);
        break;
      }
      case TX_FIELDS.TYPE: {
        this.validateLength(2);
        // intentional lack of reverse - 1 byte does not need to be reversed
        const type = this.data.substr(0, 2);
        parsed = TX_TYPES[type];
        this.data = this.data.substr(2);
        break;
      }
      case TX_FIELDS.WIRE_COUNT: {
        this.validateLength(4);
        const count = fixByteOrder(this.data.substr(0, 4));
        parsed = parseInt(count, 16);
        this.data = this.data.substr(4);
        break;
      }
      case TX_FIELDS.WIRES: {
        const count = this.resp[TX_FIELDS.WIRE_COUNT];
        const expLength = count * 28;// 4+8+16(node+user+amount)
        this.validateLength(expLength);

        parsed = {};
        for (let i = 0; i < count; i += 1) {
          const node = fixByteOrder(this.data.substr(0, 4));
          const user = fixByteOrder(this.data.substr(4, 8));
          const amount = fixByteOrder(this.data.substr(12, 16));
          const address = formatAddress(node, user);
          parsed[address] = parseInt(amount, 16);
          this.data = this.data.substr(28);
        }
        break;
      }

      default:
        throw new TransactionDataError('Invalid transaction field type');
    }

    this.resp[fieldName] = parsed;
    this.parsed = parsed;

    return this;
  }

  skip(charCount) {
    this.parsed = this.data.substr(0, charCount);
    this.data = this.data.substr(charCount);
    return this;
  }

  get lastDecodedField() {
    return this.parsed;
  }

  get decodeData() {
    return this.resp;
  }

  validateLength(expectedLength) {
    if (this.data.length < expectedLength) {
      throw new TransactionDataError('Invalid transaction data length');
    }
  }
}

/**
 * Encode command data.
 *
 * @param command
 * @returns {string}
 */
function encodeCommand(command) {

}

/**
 * Decode command data.
 *
 * @param data string
 * @returns {object}
 */
function decodeCommand(data) {
  const decoder = new Decoder(data).decode(TX_FIELDS.TYPE);
  const type = decoder.lastDecodedField;

  switch (type) {
    case 'broadcast':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.MSG_LEN)
        .decode(TX_FIELDS.MSG);
      break;

    case 'change_account_key':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.PUBLIC_KEY);
      break;

    case 'change_node_key':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.NODE)
        .decode(TX_FIELDS.PUBLIC_KEY);
      break;

    case 'create_account':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.NODE)
        .skip(8)
        .decode(TX_FIELDS.PUBLIC_KEY);
      break;

    case 'create_node':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME);
      break;

    case 'get_account':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.ADDRESS)
        .decode(TX_FIELDS.TIME);
      break;

    case 'get_accounts':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID)// previous block id
        .decode(TX_FIELDS.NODE);
      break;

    case 'get_block':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.BLOCK_ID)// previous block id
        .decode(TX_FIELDS.TIME);
      break;

    case 'get_blocks':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID_FROM)
        .decode(TX_FIELDS.BLOCK_ID_TO);
      break;

    case 'get_broadcast':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.BLOCK_ID)
        .decode(TX_FIELDS.TIME);
      break;

    case 'get_log':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME);
      break;

    case 'get_message':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID)
        .decode(TX_FIELDS.NODE)
        .decode(TX_FIELDS.NODE_MSID);
      break;

    case 'get_message_list':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID);
      break;

    case 'get_signatures':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID);
      break;

    case 'get_transaction':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.TX_ID);
      break;

    case 'get_vipkeys':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.VIP_HASH);
      break;

    case 'log_account':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME);
      break;

    case 'retrieve_funds':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.ADDRESS);
      break;

    case 'send_many':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.WIRE_COUNT)
        .decode(TX_FIELDS.WIRES);
      break;

    case 'send_one':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.ADDRESS)
        .decode(TX_FIELDS.AMOUNT)
        .decode(TX_FIELDS.MSG);
      break;

    case 'set_account_status':
    case 'unset_account_status':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.ADDRESS)
        .decode(TX_FIELDS.STATUS_ACCOUNT);
      break;

    case 'set_node_status':
    case 'unset_node_status':
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MSID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.NODE)
        .decode(TX_FIELDS.STATUS_NODE);
      break;

    case 'get_fields':// function `get_fields` does not return `tx.data`
      throw new TransactionDataError('Transaction is not parsable');

    default:
      throw new TransactionDataError('Unknown type of transaction');
  }

  return decoder.decodeData;
}

export default {
  TX_FIELDS,
  TX_TYPES,
  addressChecksum,
  validateAddress,
  validateKey,
  validateSignature,
  sign,
  getPublicKey,
  encodeCommand,
  decodeCommand,
};
