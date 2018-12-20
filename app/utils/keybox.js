import bip39 from 'bip39';
import { getMasterKeyFromSeed, derivePath, getPublicKeyFromSeed as getPkFromSeed, getPublicKeyFromSecret as getPkFromSecret } from './ed25519-hd-key';

const getPublicKeyFromSeed = secretKey => getPkFromSeed(secretKey).toString('hex').slice(2).toUpperCase();
const getPublicKeyFromSecret = secretKey => getPkFromSecret(secretKey).toString('hex').slice(2).toUpperCase();

function generateKeyPair(seed, path) {
  let key;
  if (path) {
    key = derivePath(path, seed).key;
  } else {
    key = getMasterKeyFromSeed(seed).key;
  }
  return {
    type: 'auto',
    secretKey: key.toString('hex').toUpperCase(),
    // slice(2) because public key is left pad with '00'
    publicKey: getPublicKeyFromSeed(key),
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
  getPublicKeyFromSeed,
  getPublicKeyFromSecret,
  seedPhraseToHex,
  generateKeys,
  generateNextKey,
  generateSeedPhrase,
};
