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
  return generateKeyPair(seed, `m/${index}'`);
}

function generateKeys(seedPhrase, quantity) {
  const seed = bip39.mnemonicToSeedHex(seedPhrase);
  const keys = [];
  keys.push({
    name: 'master',
    ...generateKeyPair(seed)
  });
  for (let i = 1; i <= quantity; i++) {
    const n = i.toString().padStart(2, '0');
    keys.push({
      name: `N${n}`,
      ...generateKeyPair(seed, `m/${i}'`)
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
