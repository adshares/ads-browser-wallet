import createHmac from 'create-hmac';
import nacl from 'tweetnacl';

const ED25519_CURVE = 'ed25519 seed';
const HARDENED_OFFSET = 0x80000000;
const pathRegex = new RegExp("^m(\\/[0-9]+')+$");
const replaceDerive = val => (val.replace("'", ''));

exports.getMasterKeyFromSeed = (seed) => {
  const hmac = createHmac('sha512', ED25519_CURVE);
  const I = hmac.update(Buffer.from(seed, 'hex')).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
};
const ckdPriv = ({ key, chainCode }, index) => {
  const indexBuffer = Buffer.allocUnsafe(4);
  indexBuffer.writeUInt32BE(index, 0);
  const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);
  const I = createHmac('sha512', chainCode)
    .update(data)
    .digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
};
exports.getPublicKey = (privateKey, withZeroByte = true) => {
  const { publicKey } = nacl.sign.keyPair.fromSeed(privateKey);
  const zero = Buffer.alloc(1, 0);
  return withZeroByte ?
    Buffer.concat([zero, Buffer.from(publicKey)]) :
    Buffer.from(publicKey);
};
exports.isValidPath = (path) => {
  if (!pathRegex.test(path)) {
    return false;
  }
  return !path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .some(isNaN);
};
exports.derivePath = (path, seed) => {
  if (!exports.isValidPath(path)) {
    throw new Error('Invalid derivation path');
  }
  const { key, chainCode } = exports.getMasterKeyFromSeed(seed);
  const segments = path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .map(el => parseInt(el, 10));
  return segments.reduce(
    (parentKeys, segment) => ckdPriv(parentKeys, segment + HARDENED_OFFSET),
    { key, chainCode }
  );
};
