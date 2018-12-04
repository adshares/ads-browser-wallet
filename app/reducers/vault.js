import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  empty: true,
  sealed: true,
  seed: '',
  keys: []
};

const actionsMap = {
  [ActionTypes.CREATE_VALUT](state, action) {
    console.debug(action);
    return {
      ...state,
      empty: false
    };
  },
  [ActionTypes.UNSEAL_VALUT](state, action) {
    console.debug(action);
    return {
      ...state,
      sealed: false
    };
  },
};

export default function valut(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
