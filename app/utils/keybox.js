/* eslint-disable no-plusplus */
import bip39 from 'bip39';
import {
  getMasterKeyFromSeed,
  derivePath,
  getPublicKeyFromSeed as getPkFromSeed
} from './ed25519-hd-key';
import { hexToByte } from './utils';

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
  return generateKeyPair(seed, `m/${index}'`);
}

function generateKeys(seed, quantity) {
  const keys = [];
  keys.push({
    name: 'Master',
    ...generateKeyPair(seed)
  });
  for (let i = 1; i < quantity; i++) {
    const n = i.toString()
      .padStart(2, '0');
    keys.push({
      name: `M${n}`,
      ...generateNextKey(seed, i)
    });
  }

  return keys;
}

function generateNewKeys(seed, currentAmount, quantity = currentAmount + 5) {
  const keys = [];
   // hack +1 is because one of the key is named master so we start number ith gap
  // between numerated keys names
  for (let i = currentAmount; i <= quantity; i++) {
    const n = i.toString()
      .padStart(2, '0');
    keys.push({
      name: `M${n}`,
      type: 'auto',
      ...generateNextKey(seed, i)
    });
  }
  return keys;
}

function generateSeedPhrase() {
  return bip39.generateMnemonic();
}

export {
  getPublicKeyFromSecret,
  seedPhraseToHex,
  generateKeys,
  generateNextKey,
  generateSeedPhrase,
  generateNewKeys
};
