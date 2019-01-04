import * as actions from '../actions/authDialogActions';

const initialState = {
  uuid: null,
  isOpened: false,
  isConfirmed: false,
  isRejected: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.OPEN_DIALOG: {
      return {
        ...state,
        uuid: action.uuid,
        isOpened: true,
        isConfirmed: false,
        isRejected: false,
      };
    }
    case actions.PASSWORD_CONFIRMED: {
      return {
        ...state,
        isOpened: false,
        isConfirmed: true,
        isRejected: false,
      };
    }
    case actions.PASSWORD_REJECTED: {
      return {
        ...state,
        isOpened: false,
        isConfirmed: false,
        isRejected: true,
      };
    }
    default:
      return state;
  }
}
