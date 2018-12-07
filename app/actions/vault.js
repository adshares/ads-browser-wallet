import * as types from '../constants/ActionTypes';

export function create(password, seedPhrase) {
  return { type: types.CREATE_VAULT, password, seedPhrase };
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

export function sync(password) {
  return { type: types.SYNC_VAULT, password };
}
