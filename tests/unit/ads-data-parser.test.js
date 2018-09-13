'use strict';

const parser = require('../../src/scripts/ads-data-parser');

test('parse broadcast', () => {
    // {"run":"broadcast","message":"00"}
    const data = '030100000000001300000066639A5B010000';
    let parsedData = parser.parseData(data);
    expect(parsedData[parser.FIELD.TYPE]).toBe('broadcast');
    expect(parsedData[parser.FIELD.MSG]).toBe('00');
});

test('parse get_account', () => {
    // {"run":"get_account","address":"0001-00000000-9B6F"}
    const data = '100100000000000100010000004D7B9A5B';
    let parsedData = parser.parseData(data);
    expect(parsedData[parser.FIELD.TYPE]).toBe('get_account');
    expect(parsedData[parser.FIELD.ADDRESS_DEST]).toBe('0001-00000001-8B4E');
});

test('parse send_many', () => {
    // {"run":"send_many", "wires":{"0001-00000001-8B4E":"100","0001-00000002-BB2D":"100"}}
    const data = '050100000000000400000069C0485B020001000100000000A0724E1809000001000200000000A0724E18090000';
    let parsedData = parser.parseData(data);
    expect(parsedData[parser.FIELD.TYPE]).toBe('send_many');
    expect(parsedData[parser.FIELD.WIRE_COUNT]).toBe(2);

    const wires = parsedData[parser.FIELD.WIRES];
    expect(wires).hasOwnProperty('0001-00000001-8B4E');
    expect(wires['0001-00000001-8B4E']).toBe(100 * 100000000000);
    expect(wires).hasOwnProperty('0001-00000002-BB2D');
    expect(wires['0001-00000002-BB2D']).toBe(100 * 100000000000);
});

test('parse send_one', () => {
    // {"run":"send_one","address":"0001-00000001-8B4E","amount":"100000"}
    const data = '04010000000000010000006F0A645B0100010000000000C16FF2862300000' +
        '0000000000000000000000000000000000000000000000000000000000000';
    let parsedData = parser.parseData(data);
    expect(parsedData[parser.FIELD.TYPE]).toBe('send_one');
    expect(parsedData[parser.FIELD.ADDRESS_DEST]).toBe('0001-00000001-8B4E');
    expect(parsedData[parser.FIELD.AMOUNT]).toBe(100000 * 100000000000);
});
