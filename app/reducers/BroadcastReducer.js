import ADS from '../utils/ads';
import * as TR from './TransactionReducer';

const initialState = {
  ...TR.initialState,
  inputs: {
    message: {
      isValid: null,
      value: '',
      errorMsg: ''
    },
    rawMessage: {
      noValid: true,
      isValid: true,
      value: true,
      errorMsg: ''
    }
  }
};

const actionsMap = {
  ...TR.actionsMap
};

export default function (state = initialState, action) {
  if (action.transactionType !== ADS.TX_TYPES.BROADCAST) return state;
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
