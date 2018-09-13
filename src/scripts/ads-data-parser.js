'use strict';

/**
 * Response field names
 */
const FIELD = {
    /** receiver address */
    ADDRESS_DEST: 'destAddress',
    /** sender address */
    ADDRESS_SRC: 'srcAddress',
    /** transaction amount */
    AMOUNT: 'amount',
    /** transaction date */
    DATE: 'date',
    /** message */
    MSG: 'message',
    /** message length */
    MSG_LEN: 'message_length',
    /** number of sender transactions */
    MSID: 'msid',
    /** transaction type */
    TYPE: 'type',
    /** number of wires */
    WIRE_COUNT: 'wire_count',
    /** wires */
    WIRES: 'wires',
};
/**
 * Transaction types
 */
const TX_TYPE = {
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
    '10': 'get_account',
    '11': 'get_log',
    '12': 'get_broadcast',
    '13': 'get_blocks',
    '14': 'get_transaction',
    '15': 'get_vipkeys',
    '16': 'get_signatures',
    '17': 'get_block',
    '18': 'get_accounts',
    '19': 'get_message_list',
    '1A': 'get_message',
    '1B': 'get_fields',
};

/**
 * Changes hex string from little-endian to big-endian.
 *
 * @param {string} data
 * @returns {string | *}
 */
function fixByteOrder(data) {
    // match - splits string to array of 2 characters
    // reverse - changes order of chunks
    // join - combines chunks to string
    return data.match(/.{1,2}/g).reverse().join('');
}

/**
 * Converts hexadecimal string to Uint8Array.
 *
 * @param {string} data hexadecimal string without leading '0x'
 * @returns {Uint8Array} converted data
 */
function hexToByte(data) {
    if (!data) {
        return new Uint8Array(0);
    }
    let a = [];
    for (let i = 0, len = data.length; i < len; i += 2) {
        a.push(parseInt(data.substr(i, 2), 16));
    }
    return new Uint8Array(a);
}

/**
 * Calculates CRC16.
 *
 * @param {string} data hexadecimal string without leading '0x'
 * @returns {string} checksum
 */
function crc16(data) {
    const binData = hexToByte(data);

    let crc = 0x1d0f;
    for (let b of binData) {
        let x = (crc >> 8) ^ b;
        x ^= x >> 4;
        crc = ((crc << 8) ^ ((x << 12)) ^ ((x << 5)) ^ (x)) & 0xFFFF;
    }
    const result = '0000' + crc.toString(16);

    return result.substr(result.length - 4)
}

function formatAddress(node, user) {
    return (node + '-' + user + '-' + crc16(node + user)).toUpperCase();
}

function formatMoney(amount, precision, decimal, thousand) {
    let n = amount,
        c = isNaN(precision = Math.abs(precision)) ? 2 : precision,
        d = typeof decimal === 'undefined' ? "." : decimal,
        t = typeof thousand === 'undefined' ? "," : thousand,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = i.length > 3 ? i.length % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

class Parser {

    constructor(data) {
        this.data = data;
        this.resp = {};
    }

    parse(dataType) {
        let parsed = undefined;
        switch (dataType) {
            case FIELD.ADDRESS_DEST:
            case FIELD.ADDRESS_SRC:
                this.validateLength(12);
                let node = fixByteOrder(this.data.substr(0, 4));
                let user = fixByteOrder(this.data.substr(4, 8));
                parsed = formatAddress(node, user);
                this.resp[dataType] = parsed;
                this.data = this.data.substr(12);
                break;

            case FIELD.AMOUNT:
                this.validateLength(16);
                parsed = fixByteOrder(this.data.substr(0, 16));
                // parsed = formatMoney(parseInt(parsed, 16) / 100000000000, 11);
                parsed = parseInt(parsed, 16);
                this.resp[dataType] = parsed;
                this.data = this.data.substr(16);
                break;

            case FIELD.DATE:
                this.validateLength(8);
                let time = fixByteOrder(this.data.substr(0, 8));
                parsed = new Date(parseInt(time, 16) * 1000);
                this.resp[dataType] = parsed;
                this.data = this.data.substr(8);
                break;

            case FIELD.MSG:
                const expectedLength = (this.resp[FIELD.TYPE] === 'send_one') ? 64 : this.resp[FIELD.MSG_LEN] * 2;
                this.validateLength(expectedLength);
                parsed = this.data;
                this.resp[dataType] = parsed;
                this.data = '';
                break;

            case FIELD.MSG_LEN:
                this.validateLength(4);
                parsed = fixByteOrder(this.data.substr(0, 4));
                parsed = parseInt(parsed, 10);
                this.resp[dataType] = parsed;
                this.data = this.data.substr(4);
                break;

            case FIELD.MSID:
                this.validateLength(8);
                parsed = fixByteOrder(this.data.substr(0, 8));
                parsed = parseInt(parsed, 10);
                this.resp[dataType] = parsed;
                this.data = this.data.substr(8);
                break;

            case FIELD.TYPE:
                this.validateLength(2);
                let type = this.data.substr(0, 2);
                parsed = TX_TYPE[type];
                this.resp[dataType] = parsed;
                this.data = this.data.substr(2);
                break;

            case FIELD.WIRE_COUNT:
                this.validateLength(4);
                let count = fixByteOrder(this.data.substr(0, 4));
                parsed = parseInt(count, 10);
                this.resp[dataType] = parsed;
                this.data = this.data.substr(4);
                break;

            case FIELD.WIRES: {
                const count = this.resp[FIELD.WIRE_COUNT];
                const expLength = count * 28;//4+8+16(node+user+amount)
                this.validateLength(expLength);

                parsed = {};
                for (let i = 0; i < count; i++) {
                    let node = fixByteOrder(this.data.substr(0, 4));
                    let user = fixByteOrder(this.data.substr(4, 8));
                    let amount = fixByteOrder(this.data.substr(12, 16));
                    let address = formatAddress(node, user);
                    parsed[address] = parseInt(amount, 16);
                    this.data = this.data.substr(28);
                }
                this.resp[dataType] = parsed;
                break;
            }
            default:
                throw new Error('Invalid type');
        }

        this.parsed = parsed;
        return this;
    }

    get lastParsedField() {
        return this.parsed;
    }

    get parsedData() {
        return this.resp;
    }

    validateLength(expectedLength) {
        if (this.data.length < expectedLength) {
            throw new Error('Invalid data length');
        }
    }
}

/**
 * Parses hexadecimal string of transaction data.
 *
 * @param data hexadecimal encoded transaction without leading '0x'
 * @returns {object} decoded data as json
 */
function parseData(data) {
    let parser = new Parser(data).parse(FIELD.TYPE);
    let type = parser.lastParsedField;
    console.log(type, data);

    switch (type) {
        case 'broadcast':
            parser.parse(FIELD.ADDRESS_SRC)
                .parse(FIELD.MSID)
                .parse(FIELD.DATE)
                .parse(FIELD.MSG_LEN)
                .parse(FIELD.MSG);
            break;

        case 'change_account_key':
            break;

        case 'change_node_key':
            break;

        case 'create_account':
            break;

        case 'create_node':
            break;

        case 'get_account':
            parser.parse(FIELD.ADDRESS_SRC)
                .parse(FIELD.ADDRESS_DEST)
                .parse(FIELD.DATE);
            break;

        case 'get_accounts':
            break;

        case 'get_block':
            break;

        case 'get_broadcast':
            break;

        case 'get_blocks':
            break;

        case 'get_fields':
            break;

        case 'get_log':
            break;

        case 'get_message':
            break;

        case 'get_message_list':
            break;

        case 'get_signatures':
            break;

        case 'get_transaction':
            break;

        case 'get_vipkeys':
            break;

        case 'log_account':
            break;

        case 'retrieve_funds':
            break;

        case 'send_many':
            parser.parse(FIELD.ADDRESS_SRC)
                .parse(FIELD.MSID)
                .parse(FIELD.DATE)
                .parse(FIELD.WIRE_COUNT)
                .parse(FIELD.WIRES);
            break;

        case 'send_one':
            parser.parse(FIELD.ADDRESS_SRC)
                .parse(FIELD.MSID)
                .parse(FIELD.DATE)
                .parse(FIELD.ADDRESS_DEST)
                .parse(FIELD.AMOUNT)
                .parse(FIELD.MSG);
            break;

        case 'set_account_status':
            break;

        case 'set_node_status':
            break;

        case 'unset_account_status':
            break;

        case 'unset_node_status':
            break;

        default:
            throw new Error('Unknown type');
    }

    console.log(parser.parsedData);
    return parser.parsedData;
}

module.exports = {FIELD, parseData};
