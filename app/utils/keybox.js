import bip39 from 'bip39';
import { getMasterKeyFromSeed, derivePath, getPublicKey } from 'ed25519-hd-key';

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
    publicKey: getPublicKey(key).toString('hex').slice(2).toUpperCase(),
  };
}

function generateMasterKey(seedPhrase) {
  const seed = bip39.mnemonicToSeedHex(seedPhrase);
  return generateKeyPair(seed);
}

function generateNextKey(seedPhrase, index) {
  const seed = bip39.mnemonicToSeedHex(seedPhrase);
  return generateKeyPair(seed, `m/0'/${index}'`);
}

function generateKeys(seedPhrase, quantity) {
  const keys = [];
  keys.push({
    name: 'master',
    ...generateMasterKey(seedPhrase)
  });
  for (let i = 1; i <= quantity; i++) {
    const n = i.toString().padStart(3, '0');
    keys.push({
      name: `N${n}`,
      ...generateNextKey(seedPhrase, i)
    });
  }

  return keys;
}

function generateSeedPhrase() {
  return bip39.generateMnemonic();
}

export default {
  generateKeys,
  generateMasterKey,
  generateNextKey,
  generateSeedPhrase
};
