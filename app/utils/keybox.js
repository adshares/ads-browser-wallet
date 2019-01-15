/* eslint-disable no-plusplus */
import bip39 from 'bip39';
import {
  getMasterKeyFromSeed,
  derivePath,
  getPublicKeyFromSeed as getPkFromSeed
} from './ed25519-hd-key';
import { hexToByte } from './utils';
import { derivationPath } from '../config/config';

const getPublicKeyFromSecret = secretKey => getPkFromSeed(hexToByte(secretKey))
  .toString('hex')
  .slice(2)
  .toUpperCase();

function generateKeyPair(seed, path) {
  let key;
  if (path) {
    key = derivePath(path, seed).key;
  } else {
    key = getMasterKeyFromSeed(seed).key;
  }
  return {
    type: 'auto',
    secretKey: key.toString('hex')
      .toUpperCase(),
    // slice(2) because public key is left pad with '00'
    publicKey: getPkFromSeed(key)
      .toString('hex')
      .slice(2)
      .toUpperCase(),
  };
}

function seedPhraseToHex(seedPhrase) {
  return bip39.mnemonicToSeedHex(seedPhrase);
}

function generateNextKey(seed, index) {
  const path = `${derivationPath}${index}'`;
  return {
    name: path,
    ...generateKeyPair(seed, path)
  };
}

function generateKeys(seed, from, to) {
  const keys = [];
  for (let i = from; i < to; i++) {
    keys.push(generateNextKey(seed, i));
  }
  return keys;
}

function initKeys(seed, quantity) {
  const keys = [];
  keys.push({
    name: 'Master',
    ...generateKeyPair(seed),
    type: 'master',
  });
  keys.push(...generateKeys(seed, 0, quantity));
  return keys;
}

function generateSeedPhrase() {
  return bip39.generateMnemonic();
}

export {
  getPublicKeyFromSecret,
  seedPhraseToHex,
  initKeys,
  generateNextKey,
  generateSeedPhrase,
  generateKeys
};
