/* eslint-disable no-plusplus */
import bip39 from 'bip39';
import {
  getMasterKeyFromSeed,
  derivePath,
  getPublicKeyFromSeed as getPkFromSeed
} from './ed25519-hd-key';
import { hexToByte } from './utils';
import { derivationPath } from '../config/config';

export const getPublicKeyFromSecret = secretKey => getPkFromSeed(hexToByte(secretKey))
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

export function seedPhraseToHex(seedPhrase) {
  return bip39.mnemonicToSeedHex(seedPhrase);
}

export function generateNextKey(seed, index) {
  const path = `${derivationPath}${index}'`;
  return {
    name: path,
    index,
    ...generateKeyPair(seed, path)
  };
}

export function generateKeys(seed, from, to) {
  const keys = [];
  for (let i = from; i < to; i++) {
    keys.push(generateNextKey(seed, i));
  }
  return keys;
}

export function initKeys(seed, quantity) {
  const keys = [];
  keys.push({
    name: 'Master',
    ...generateKeyPair(seed),
    type: 'master',
  });
  keys.push(...generateKeys(seed, 0, quantity));
  return keys;
}

export function findKeyIndex(seed, publicKey) {
  const step = 10;
  const steps = 10;
  let key;
  for (let i = 0; i < steps; ++i) {
    key = generateKeys(seed, step * i, step * (i + 1))
      .find(k => k.publicKey === publicKey);
    if (key) {
      return key.index;
    }
  }
  return -1;
}

export function generateSeedPhrase() {
  return bip39.generateMnemonic();
}
