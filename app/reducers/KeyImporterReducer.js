import * as actions from '../actions/form';
import KeysImporterPage from '../containers/Settings/KeysImporterPage';
import { actionsMap as FormReducers } from './formControlsReducer';

const initialState = {
  isSubmitted: false,
  auth: {
    password: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    authModalOpen: false,
    authConfirmed: false
  },
  inputs: {
    name: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    publicKey: {
      shown: false,
      isValid: false,
      value: '',
      errorMsg: ''
    },
    secretKey: {
      isValid: false,
      value: '',
      errorMsg: ''
    }
  }
};

const actionsMap = {
  ...FormReducers,
  [actions.FORM_CLEANING](state, action) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },
};

export default function (state = initialState, action) {
  if (action.pageName !== KeysImporterPage.PAGE_NAME) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
