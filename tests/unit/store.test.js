'use strict';

const {ChromeStorage} = require('./mock-chrome-store-local');
const store = require('../../src/scripts/store');
global.chrome = {};
global.chrome.storage = {};
global.chrome.storage.local = ChromeStorage;
global.chrome.runtime = {};

test('r/w encrypted store', () => {
    expect.assertions(3);

    const pass = '!QW$%G$*';
    const key = '1';
    const value = '0123456789';

    // write data
    expect(store.setEncryptedData(key, value, pass)).resolves.toBeUndefined();

    // read data
    expect(store.getEncryptedData(key, pass)).resolves.toEqual(value);
    // fail-safe read data
    expect(store.getEncryptedData(key, pass)).resolves.not.toEqual('a' + value);
});

test('read encrypted with invalid pass', () => {
    expect.assertions(2);

    const pass = '!QW$%G$*';
    const pass2 = '!QW$%G$1';
    const key = '2';
    const value = '0123456789';

    // write data
    expect(store.setEncryptedData(key, value, pass)).resolves.toBeUndefined();

    // read data
    store.getEncryptedData(key, pass2).catch(e => expect(e).toEqual('Invalid pass'));
});

test('read encrypted with invalid key', () => {
    expect.assertions(1);

    const pass = '!QW$%G$*';
    const key = '3';

    // read data
    expect(store.getEncryptedData(key, pass)).resolves.toBeUndefined();
});

test('r/w store', () => {
    expect.assertions(3);

    const key = '1';
    const value = '0123456789';

    // write data
    expect(store.setData(key, value)).resolves.toBeUndefined();

    // read data
    expect(store.getData(key)).resolves.toEqual(value);
    // fail-safe read data
    expect(store.getData(key)).resolves.not.toEqual('a' + value);
});

test('read with invalid key', () => {
    expect.assertions(1);

    const key = '3';

    // read data
    expect(store.getData(key)).resolves.toBeUndefined();
});