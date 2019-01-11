import * as actions from '../actions/formActions';
import * as settingsActions from '../actions/settingsActions';
import FormReducers from './FormControlsReducer';

const initialState = {
  isSubmitted: false,
  isKeySaved: false,
  errorMsg: '',
  inputs: {
    name: {
      isValid: false,
      value: '',
      errorMsg: ''
    },
    secretKey: {
      isValid: false,
      value: '',
      errorMsg: '',
      private: true
    },
    publicKey: {
      shown: false,
      isValid: false,
      value: '',
      errorMsg: ''
    },
  }
};

const actionsMap = {
  ...FormReducers,
  [actions.CLEAN_FORM](state, action) {
    return {
      ...state,
      ...action,
      ...initialState
    };
  },
  [actions.FORM_VALIDATION_FAILURE](state, action) {
    return {
      ...state,
      ...action.payload,
      isSubmitted: false,
    };
  },
  [settingsActions.SAVE_KEY](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },
  [settingsActions.SAVE_KEY_SUCCESS](state) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: '',
      isKeySaved: true,
    };
  },
  [settingsActions.SAVE_KEY_FAILURE](state, action) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: action.errorMsg,
    };
  },
};

export default function (state = initialState, action) {
  if (action.pageName !== settingsActions.SAVE_KEY) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
