import * as SA from '../actions/settingsActions';
import * as FA from '../actions/formActions';

const initialState = {
  isSubmitted: false,
  isAccountsImported: false,
  accountsCount: 0,
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
  [SA.FIND_ALL_ACCOUNTS](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },
  [SA.FIND_ALL_ACCOUNTS_SUCCESS](state, action) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: '',
      isAccountsImported: true,
      accountsCount: action.accountsCount,
    };
  },
  [SA.FIND_ALL_ACCOUNTS_FAILURE](state, action) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: action.errorMsg,
    };
  },
};

export default function (state = initialState, action) {
  const actual = { ...initialState, ...state };
  if (action.pageName !== SA.SETTINGS || !actionsMap[action.type]) {
    return actual;
  }
  return actionsMap[action.type](actual, action);
}
