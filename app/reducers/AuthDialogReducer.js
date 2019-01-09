import * as actions from '../actions/authDialogActions';

const initialState = {
  name: 'global',
  isOpened: false,
  isConfirmed: false,
  isRejected: false,
  errorMsg: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.OPEN_DIALOG: {
      return {
        ...initialState,
        name: action.name,
        isOpened: true,
      };
    }
    case actions.CLOSE_DIALOG: {
      return {
        ...state,
        isOpened: false,
      };
    }
    case actions.RESET_DIALOG: {
      return {
        ...initialState,
      };
    }
    case actions.INVALID_PASSWORD: {
      return {
        ...state,
        errorMsg: action.errorMsg,
      };
    }
    case actions.PASSWORD_CONFIRMED: {
      return {
        ...state,
        isOpened: false,
        isConfirmed: true,
        isRejected: false,
        errorMsg: '',
      };
    }
    case actions.PASSWORD_REJECTED: {
      return {
        ...state,
        isOpened: false,
        isConfirmed: false,
        isRejected: true,
        errorMsg: '',
      };
    }
    default:
      return state;
  }
}
