import * as actions from '../actions/importKeys';
import {
  InvalidPasswordError,
  AccountsLimitError,
  UnknownPublicKeyError,
  ItemNotFound,
} from '../actions/errors';
import config from '../config';

const initialState = {
  form: {
    authConfirmed: false,
    isSubmitted: false,
    name: {
      isValid: false,
      value: '',
      error: ''
    },
    publicKey: {
      isValid: false,
      value: '',
      error: '',
    },
    secretKey: {
      isValid: false,
      value: '',
      error: ''
    }
  }
};

const actionsMap = {
  [actions.VALIDATE_FORM](state, action) {
    console.debug('VALIDATE_FORM');
    return {
      ...state,
      ...action.payload
    };
  },
};

export default function (state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
