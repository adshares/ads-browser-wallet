import * as types from '../constants/ActionTypes';

export function create(password, seedPhrase) {
  return { type: types.CREATE_VAULT, password, seedPhrase };
}

export function unseal(password) {
  return { type: types.UNSEAL_VAULT, password };
}

export function seal(password) {
  return { type: types.SEAL_VAULT, password };
}
