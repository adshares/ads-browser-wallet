/* eslint-disable no-bitwise */
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
  BLOCK_ID: 'blockId',
  /** block id */
  BLOCK_ID_FROM: 'blockIdFrom',
  /** block id */
  BLOCK_ID_TO: 'blockIdTo',
  /** message */
  MSG: 'message',
  /** message length */
  MSG_LEN: 'messageLength',
  /** number of sender transactions */
  MESSAGE_ID: 'messageId',
  /** node */
  NODE_ID: 'nodeId',
  /** number of node message */
  NODE_MESSAGE_ID: 'nodeMessageId',
  /** public key */
  PUBLIC_KEY: 'publicKey',
  /** sender address */
  SENDER: 'sender',
  /** account */
  STATUS_ACCOUNT: 'accountStatus',
  /** node status */
  STATUS_NODE: 'nodeStatus',
  /** transaction time */
  TIME: 'time',
  /** transaction id */
  TRANSACTION_ID: 'transactionId',
  /** transaction type */
  TYPE: 'type',
  /** vip hash */
  VIP_HASH: 'vipHash',
  /** number of wires */
  WIRE_COUNT: 'wireCount',
  /** wires */
  WIRES: 'wires',
};

/**
 * Transaction types
 */
const TX_TYPES = {
  BROADCAST: 'broadcast',
  CHANGE_ACCOUNT_KEY: 'change_account_key',
  CHANGE_NODE_KEY: 'change_node_key',
  CREATE_ACCOUNT: 'create_account',
  CREATE_NODE: 'create_node',
  LOG_ACCOUNT: 'log_account',
  GET_ACCOUNT: 'get_account',
  GET_ACCOUNTS: 'get_accounts',
  GET_BLOCK: 'get_block',
  GET_BLOCKS: 'get_blocks',
  GET_BROADCAST: 'get_broadcast',
  GET_FIELDS: 'get_fields',
  GET_LOG: 'get_log',
  GET_MESSAGE: 'get_message',
  GET_MESSAGE_LIST: 'get_message_list',
  GET_SIGNATURES: 'get_signatures',
  GET_TRANSACTION: 'get_transaction',
  GET_VIPKEYS: 'get_vipkeys',
  RETRIEVE_FUNDS: 'retrieve_funds',
  SEND_AGAIN: 'send_again',
  SEND_MANY: 'send_many',
  SEND_ONE: 'send_one',
  SET_ACCOUNT_STATUS: 'set_account_status',
  SET_NODE_STATUS: 'set_node_status',
  UNSET_ACCOUNT_STATUS: 'unset_account_status',
  UNSET_NODE_STATUS: 'unset_node_status',
};

/**
 * Transaction types map
 */
const TX_TYPES_MAP = {
  '03': TX_TYPES.BROADCAST,
  '04': TX_TYPES.SEND_ONE,
  '05': TX_TYPES.SEND_MANY,
  '06': TX_TYPES.CREATE_ACCOUNT,
  '07': TX_TYPES.CREATE_NODE,
  '08': TX_TYPES.RETRIEVE_FUNDS,
  '09': TX_TYPES.CHANGE_ACCOUNT_KEY,
  '0A': TX_TYPES.CHANGE_NODE_KEY,
  '0B': TX_TYPES.SET_ACCOUNT_STATUS,
  '0C': TX_TYPES.SET_NODE_STATUS,
  '0D': TX_TYPES.UNSET_ACCOUNT_STATUS,
  '0E': TX_TYPES.UNSET_NODE_STATUS,
  '0F': TX_TYPES.LOG_ACCOUNT,
  10: TX_TYPES.GET_ACCOUNT,
  11: TX_TYPES.GET_LOG,
  12: TX_TYPES.GET_BROADCAST,
  13: TX_TYPES.GET_BLOCKS,
  14: TX_TYPES.GET_TRANSACTION,
  15: TX_TYPES.GET_VIPKEYS,
  16: TX_TYPES.GET_SIGNATURES,
  17: TX_TYPES.GET_BLOCK,
  18: TX_TYPES.GET_ACCOUNTS,
  19: TX_TYPES.GET_MESSAGE_LIST,
  '1A': TX_TYPES.GET_MESSAGE,
  '1B': TX_TYPES.GET_FIELDS,
};

/**
 * Calculates CRC16 checksum.
 *
 * @param data a input data
 * @returns {string} checksum (4 hexadecimal characters)
 */
function crc16(data) {
  const d = hexToByte(sanitizeHex(data));

  let crc = 0x1d0f;
  /*eslint no-bitwise: ["error", { "allow": ["^", "^=", "&", ">>", "<<"] }]*/
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
 *
 * @param address
 * @returns {{nodeId: string, userAccountId: string, checksum: string}}
 */
function splitAddress(address) {
  const addressRegexp = /^([0-9a-fA-F]{4})-([0-9a-fA-F]{8})-([0-9a-fA-FX]{4})$/;
  const matches = addressRegexp.exec(address);
  if (!matches) {
    return null;
  }
  return {
    nodeId: sanitizeHex(matches[1]),
    userAccountId: sanitizeHex(matches[2]),
    checksum: matches[3] === 'XXXX' ? addressChecksum(matches[1], matches[2]) : sanitizeHex(matches[3])
  };
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

  const parts = splitAddress(address);
  if (!parts || !parts.nodeId || !parts.userAccountId || !parts.checksum) {
    return false;
  }

  return parts.checksum === addressChecksum(parts.nodeId, parts.userAccountId);
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
    hexToByte(data),
    hexToByte(secretKey + publicKey),
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

class Encoder {
  constructor(obj) {
    this.obj = obj;
    this.data = '';
    this.parsed = null;
    this.encode(TX_FIELDS.TYPE);
  }

  encode(fieldName) {
    let data;
    const val = this.obj[fieldName];
    switch (fieldName) {
      case TX_FIELDS.ADDRESS:
      case TX_FIELDS.SENDER: {
        const address = splitAddress(val);
        const node = fixByteOrder(this.pad(address.nodeId, 4));
        const user = fixByteOrder(this.pad(address.userAccountId, 8));
        data = node + user;
        break;
      }
      case TX_FIELDS.AMOUNT: {
        data = fixByteOrder(this.pad(val.toString(16), 16));
        break;
      }
      case TX_FIELDS.MESSAGE_ID:
      case TX_FIELDS.NODE_MESSAGE_ID: {
        data = fixByteOrder(this.pad(val.toString(16), 8));
        break;
      }
      case TX_FIELDS.MSG: {
        data = this.obj[TX_FIELDS.TYPE] === TX_TYPES.SEND_ONE ? this.pad(val, 64) : val;
        break;
      }
      case TX_FIELDS.TIME: {
        const time = Math.floor(val.getTime() / 1000);
        data = fixByteOrder(this.pad(time.toString(16), 8));
        break;
      }
      case TX_FIELDS.TYPE: {
        const type = Object.keys(TX_TYPES_MAP).find(key => TX_TYPES_MAP[key] === val);
        data = this.pad(type, 2);
        break;
      }
      default:
        throw new TransactionDataError('Invalid transaction field type');
    }
    this.parsed = data;
    this.data += data;

    return this;
  }

  get lastEncodedField() {
    return this.parsed;
  }

  get encodedData() {
    return this.data;
  }

  pad = (field, length) => field.padStart(length, '0');
}

class Decoder {
  constructor(data) {
    this.data = data;
    this.resp = {};
    this.parsed = null;
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
        // eslint-disable-next-line new-cap,no-undef
        parsed = BigInt(`0x${parsed}`);
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
        const expectedLength = (this.resp[TX_FIELDS.TYPE] === TX_TYPES.SEND_ONE) ?
          64 :
          this.resp[TX_FIELDS.MSG_LEN] * 2;
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
      case TX_FIELDS.MESSAGE_ID:
      case TX_FIELDS.NODE_MESSAGE_ID: {
        this.validateLength(8);
        parsed = fixByteOrder(this.data.substr(0, 8));
        parsed = parseInt(parsed, 16);
        this.data = this.data.substr(8);
        break;
      }
      case TX_FIELDS.NODE_ID: {
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
        parsed = parseInt(parsed, 16);
        this.data = this.data.substr(8);
        break;
      }
      case TX_FIELDS.TRANSACTION_ID: {
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
        parsed = TX_TYPES_MAP[type];
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

        parsed = [];
        for (let i = 0; i < count; i += 1) {
          const node = fixByteOrder(this.data.substr(0, 4));
          const user = fixByteOrder(this.data.substr(4, 8));
          const amount = fixByteOrder(this.data.substr(12, 16));
          const address = formatAddress(node, user);
          parsed.push({
            [TX_FIELDS.ADDRESS]: address,
            // eslint-disable-next-line new-cap,no-undef
            [TX_FIELDS.AMOUNT]: BigInt(`0x${amount}`)
          });
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

  get decodedData() {
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
  const encoder = new Encoder(command);

  switch (command[TX_FIELDS.TYPE]) {
    case TX_TYPES.SEND_ONE:
      encoder.encode(TX_FIELDS.SENDER)
        .encode(TX_FIELDS.MESSAGE_ID)
        .encode(TX_FIELDS.TIME)
        .encode(TX_FIELDS.ADDRESS)
        .encode(TX_FIELDS.AMOUNT)
        .encode(TX_FIELDS.MSG);
      break;

    default:
      throw new TransactionDataError('Unknown type of transaction');
  }

  return encoder.encodedData.toUpperCase();
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
    case TX_TYPES.BROADCAST:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.MSG_LEN)
        .decode(TX_FIELDS.MSG);
      break;

    case TX_TYPES.CHANGE_ACCOUNT_KEY:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.PUBLIC_KEY);
      break;

    case TX_TYPES.CHANGE_NODE_KEY:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.NODE_ID)
        .decode(TX_FIELDS.PUBLIC_KEY);
      break;

    case TX_TYPES.CREATE_ACCOUNT:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.NODE_ID)
        .skip(8)
        .decode(TX_FIELDS.PUBLIC_KEY);
      break;

    case TX_TYPES.CREATE_NODE:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME);
      break;

    case TX_TYPES.GET_ACCOUNT:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.ADDRESS)
        .decode(TX_FIELDS.TIME);
      break;

    case TX_TYPES.GET_ACCOUNTS:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID)// previous block id
        .decode(TX_FIELDS.NODE_ID);
      break;

    case TX_TYPES.GET_BLOCK:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.BLOCK_ID)// previous block id
        .decode(TX_FIELDS.TIME);
      break;

    case TX_TYPES.GET_BLOCKS:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID_FROM)
        .decode(TX_FIELDS.BLOCK_ID_TO);
      break;

    case TX_TYPES.GET_BROADCAST:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.BLOCK_ID)
        .decode(TX_FIELDS.TIME);
      break;

    case TX_TYPES.GET_LOG:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME);
      break;

    case TX_TYPES.GET_MESSAGE:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID)
        .decode(TX_FIELDS.NODE_ID)
        .decode(TX_FIELDS.NODE_MESSAGE_ID);
      break;

    case TX_TYPES.GET_MESSAGE_LIST:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID);
      break;

    case TX_TYPES.GET_SIGNATURES:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.BLOCK_ID);
      break;

    case TX_TYPES.GET_TRANSACTION:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.TRANSACTION_ID);
      break;

    case TX_TYPES.GET_VIPKEYS:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.VIP_HASH);
      break;

    case TX_TYPES.LOG_ACCOUNT:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME);
      break;

    case TX_TYPES.RETRIEVE_FUNDS:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.ADDRESS);
      break;

    case TX_TYPES.SEND_MANY:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.WIRE_COUNT)
        .decode(TX_FIELDS.WIRES);
      break;

    case TX_TYPES.SEND_ONE:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.ADDRESS)
        .decode(TX_FIELDS.AMOUNT)
        .decode(TX_FIELDS.MSG);
      break;

    case TX_TYPES.SET_ACCOUNT_STATUS:
    case TX_TYPES.UNSET_ACCOUNT_STATUS:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.ADDRESS)
        .decode(TX_FIELDS.STATUS_ACCOUNT);
      break;

    case TX_TYPES.SET_NODE_STATUS:
    case TX_TYPES.UNSET_NODE_STATUS:
      decoder.decode(TX_FIELDS.SENDER)
        .decode(TX_FIELDS.MESSAGE_ID)
        .decode(TX_FIELDS.TIME)
        .decode(TX_FIELDS.NODE_ID)
        .decode(TX_FIELDS.STATUS_NODE);
      break;

    case TX_TYPES.GET_FIELDS:// function `get_fields` does not return `tx.data`
      throw new TransactionDataError('Transaction is not parsable');

    default:
      throw new TransactionDataError('Unknown type of transaction');
  }

  return decoder.decodedData;
}

/**
 * Decode hex message.
 *
 * @param value message in hex
 * @param onlyPrintable decode only if printable
 * @returns {string}
 */
function decodeMessage(value, onlyPrintable = true) {
  let hex = value === null || typeof value === 'undefined' ? '0' : value;
  hex = hex
    .toString()
    .trim()
    .replace(/^0x/, ''); // force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const chars = hex.substr(i, 2);
    const code = parseInt(chars, 16);
    if (code !== 0) {
      if (onlyPrintable && (code < 32 || code >= 127)) {
        str = '--- non-printable ---';
        break;
      }
      str += String.fromCharCode(code);
    }
  }
  return str.length > 0 ? str : '--- empty ---';
}

function formatAdsMoney(amount, precision = 4, trim = false, decimal = '.', thousand = ',') {
  return (Number(amount) || 0).toFixed(precision).replace(/([0-9]{2})(0+)$/, trim ? '$1' : '$1$2').replace(/\d(?=(\d{3})+\.)/g, `$&${thousand}`);
}

function formatClickMoney(value, precision = 11, trim = false, decimal = '.', thousand = ',') {
  const p = Math.max(precision, 2);
  let v = value;

  v = (`${v || '0'}`).padStart(11, '0');
  const l = v.length - 11;
  const a = v.substr(0, l) || '0';
  const j = a.length > 3 ? a.length % 3 : 0;
  let b = Math.round(parseInt((`${v}0`)
    .substr(l, p + 1), 10) / 10)
    .toString()
    .padStart(p, '0')
  ;
  if (trim) {
    b = b.replace(/([0-9]{2})0+$/, '$1');
  }

  return (
    (j ? a.substr(0, j) + thousand : '') +
    a.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousand}`) +
    decimal +
    b
  );
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
  decodeMessage,
  formatAdsMoney,
  formatClickMoney,
  formatAddress,
  splitAddress,
};
