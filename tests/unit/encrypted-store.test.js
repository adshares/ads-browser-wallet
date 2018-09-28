'use strict';

const store = require('../../src/scripts/encrypted-store');

test('r/w store', () => {
  const pass = '!QW$%G$*';
  const key = '1';
  const value = '0123456789';

  // write data
  store.set(key, value, pass);

  // read data
  const readValue = store.get(key, pass);
  expect(readValue).toBe(value);
});

test('read with invalid pass', () => {
  const pass = '!QW$%G$*';
  const pass2 = '!QW$%G$1';
  const key = '2';
  const value = '0123456789';

  // write data
  store.set(key, value, pass);

  // read data
  expect(() => {
    store.get(key, pass2)
  }).toThrow('Invalid pass');
});

test('read invalid key', () => {
  const pass = '!QW$%G$*';
  const key = '3';

  // read data
  expect(() => {
    store.get(key, pass)
  }).toThrow('No value matching key');
});