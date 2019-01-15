import * as SA from '../actions/settingsActions';
import * as FA from '../actions/formActions';

const initialState = {
  isSubmitted: false,
  isAccountCreated: false,
  errorMsg: ''
};

const actionsMap = {
  [FA.CLEAN_FORM](state, action) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },
  [SA.CREATE_FREE_ACCOUNT](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },
  [SA.CREATE_FREE_ACCOUNT_SUCCESS](state) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: '',
      isAccountCreated: true,
    };
  },
  [SA.CREATE_FREE_ACCOUNT_FAILURE](state, action) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: action.errorMsg,
    };
  },
};

export default function (state = initialState, action) {
  const actual = { ...initialState, ...state };
  if (action.pageName !== SA.CREATE_FREE_ACCOUNT || !actionsMap[action.type]) {
    return actual;
  }
  return actionsMap[action.type](actual, action);
}
