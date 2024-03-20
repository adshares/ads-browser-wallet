import * as actions from '../actions/formActions';
import * as settingsActions from '../actions/settingsActions';
import FormReducers from './FormControlsReducer';

const initialState = {
  isSubmitted: false,
  isPasswordChanged: false,
  errorMsg: '',
  inputs: {
    newPassword: {
      isValid: false,
      value: '',
      errorMsg: '',
      private: true
    },
    repeatedPassword: {
      isValid: false,
      value: '',
      errorMsg: '',
      private: true
    }
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
  [settingsActions.CHANGE_PASSWORD](state) {
    return {
      ...state,
      isSubmitted: true,
    };
  },
  [settingsActions.PASSWORD_CHANGE_SUCCESS](state) {
    return {
      ...state,
      isSubmitted: false,
      errorMsg: '',
      isPasswordChanged: true,
    };
  },
  [settingsActions.PASSWORD_CHANGE_FAILURE](state, action) {
    return {
      ...state,
      ...action.payload,
      isSubmitted: false,
      errorMsg: action.errorMsg,
    };
  },
};

export default function (state = initialState, action) {
  if (action.pageName !== settingsActions.CHANGE_PASSWORD) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
