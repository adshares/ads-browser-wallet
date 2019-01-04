import * as actions from '../actions/authDialogActions';

const initialState = {
  uuid: null,
  opened: false,
  confirmed: false,
  rejected: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.OPEN_DIALOG: {
      return {
        ...state,
        uuid: action.uuid,
        opened: true,
        confirmed: false,
        rejected: false,
      };
    }
    case actions.CLOSE_DIALOG: {
      return {
        ...state,
        opened: false,
        confirmed: false,
        rejected: false,
      };
    }
    case actions.PASSWORD_CONFIRMED: {
      return {
        ...state,
        opened: false,
        confirmed: true,
        rejected: false,
      };
    }
    case actions.PASSWORD_REJECTED: {
      return {
        ...state,
        opened: false,
        confirmed: false,
        rejected: true,
      };
    }
    default:
      return state;
  }
}
