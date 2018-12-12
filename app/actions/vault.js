import * as types from '../constants/ActionTypes';

export function create(password, seedPhrase, callback) {
  return { type: types.CREATE_VAULT, password, seedPhrase, callback };
}

export function erease() {
  return { type: types.EREASE_VAULT };
}

export function unseal(password) {
  return { type: types.UNSEAL_VAULT, password };
}

export function seal() {
  return { type: types.SEAL_VAULT };
}

export function addAccount(address, name, publicKey, password, callback) {
  return { type: types.ADD_ACCOUNT, address, name, publicKey, password, callback };
}

export function addKey(name, publicKey, secretKey,  signature, callback) {
  return { type: types.ADD_ACCOUNT, publicKey, secretKey,  signature, callback };
}
