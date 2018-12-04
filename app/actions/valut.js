import * as types from '../constants/ActionTypes';

export function create(password, seedPhrase) {
  return { type: types.CREATE_VALUT, password, seedPhrase };
}

export function unseal(password) {
  return { type: types.UNSEAL_VALUT, password };
}

