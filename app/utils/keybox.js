import bip39 from 'bip39';
import { getMasterKeyFromSeed, derivePath, getPublicKey as getPk } from './ed25519-hd-key';

const getPublicKey = secretKey => getPk(secretKey).toString('hex').slice(2).toUpperCase();

function generateKeyPair(seed, path) {
  let key;
  if (path) {
    key = derivePath(path, seed).key;
  } else {
    key = getMasterKeyFromSeed(seed).key;
  }
  return {
    secretKey: key.toString('hex').toUpperCase(),
    // slice(2) because public key is left pad with '00'
    publicKey: getPublicKey(key),
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
    name: 'master',
    ...generateKeyPair(seed)
  });
  for (let i = 1; i < quantity; i++) {
    const n = i.toString().padStart(2, '0');
    keys.push({
      name: `N${n}`,
      ...generateNextKey(seed, i)
    });
  }

  return keys;
}

function generateSeedPhrase() {
  return bip39.generateMnemonic();
}

export default {
  getPublicKey,
  seedPhraseToHex,
  generateKeys,
  generateNextKey,
  generateSeedPhrase,
};
