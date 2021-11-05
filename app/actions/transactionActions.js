import ADS from '../utils/ads';

export const INIT_MESSAGE_FORM = 'TRANSACTIONS_INIT_MESSAGE_FORM';
export const INPUT_CHANGED = 'TRANSACTIONS_INPUT_CHANGED';
export const VALIDATE_INPUT = 'TRANSACTIONS_VALIDATE_INPUT';
export const VALIDATE_FORM = 'TRANSACTIONS_VALIDATE_FORM';
export const INPUT_VALIDATION_SUCCESS = 'TRANSACTIONS_INPUT_VALIDATION_SUCCESS';
export const INPUT_VALIDATION_FAILURE = 'TRANSACTIONS_INPUT_VALIDATION_FAILURE';
export const FORM_VALIDATION_SUCCESS = 'TRANSACTIONS_FORM_VALIDATION_SUCCESS';
export const FORM_VALIDATION_FAILURE = 'TRANSACTIONS_FORM_VALIDATION_FAILURE';
export const CLEAN_FORM = 'TRANSACTIONS_CLEAN_FORM';
export const SIGN_TRANSACTION = 'TRANSACTIONS_SIGN_TRANSACTION';
export const TRANSACTION_ACCEPTED = 'TRANSACTIONS_TRANSACTION_ACCEPTED';
export const TRANSACTION_REJECTED = 'TRANSACTIONS_TRANSACTION_REJECTED';
export const TRANSACTION_SUCCESS = 'TRANSACTIONS_TRANSACTION_SUCCESS';
export const TRANSACTION_FAILURE = 'TRANSACTIONS_TRANSACTION_FAILURE';
export const GET_GATEWAY_FEE = 'TRANSACTIONS_GET_GATEWAY_FEE';
export const GET_GATEWAY_FEE_SUCCESS = 'TRANSACTIONS_GET_GATEWAY_FEE_SUCCESS';
export const GET_GATEWAY_FEE_FAILURE = 'TRANSACTIONS_GET_GATEWAY_FEE_FAILURE';
export const MESSAGE_SENT = 'TRANSACTIONS_MESSAGE_SENT';

export const initMessageForm = (transactionType, message) => ({
  type: INIT_MESSAGE_FORM,
  transactionType,
  message
});

export const inputChanged = (transactionType, inputName, inputValue) => ({
  type: INPUT_CHANGED,
  transactionType,
  inputName,
  inputValue
});

export const validateInput = (transactionType, inputName, gateway) => ({
  type: VALIDATE_INPUT,
  transactionType,
  inputName,
  gateway
});

export const validateForm = (transactionType, gateway) => ({
  type: VALIDATE_FORM,
  transactionType,
  gateway
});

export const inputValidateSuccess = (transactionType, inputName) => ({
  type: INPUT_VALIDATION_SUCCESS,
  transactionType,
  inputName,
});

export const inputValidateFailure = (transactionType, inputName, errorMsg) => ({
  type: INPUT_VALIDATION_FAILURE,
  transactionType,
  inputName,
  errorMsg
});

export const formValidationSuccess = transactionType => ({
  type: FORM_VALIDATION_SUCCESS,
  transactionType
});

export const formValidationFailure = transactionType => ({
  type: FORM_VALIDATION_FAILURE,
  transactionType
});

export const cleanForm = transactionType => ({
  type: CLEAN_FORM,
  transactionType
});

export const signTransaction = (transactionType, accountHash, transactionData, extra) => ({
  type: SIGN_TRANSACTION,
  transactionType,
  accountHash,
  transactionData,
  extra
});

export const transactionAccepted = (transactionType, signature) => ({
  type: TRANSACTION_ACCEPTED,
  transactionType,
  signature
});

export const transactionRejected = transactionType => ({
  type: TRANSACTION_REJECTED,
  transactionType
});

export const transactionSuccess = (
  transactionType,
  transactionId,
  transactionFee,
  accountHash,
  accountMessageId
) => ({
  type: TRANSACTION_SUCCESS,
  transactionType,
  transactionId,
  transactionFee,
  accountHash,
  accountMessageId
});

export const transactionFailure = (transactionType, errorMsg) => ({
  type: TRANSACTION_FAILURE,
  transactionType,
  errorMsg
});

export const getGatewayFee = (gatewayCode, amount, address) => ({
  type: GET_GATEWAY_FEE,
  transactionType: ADS.TX_TYPES.GATEWAY,
  gatewayCode,
  amount,
  address
});

export const getGatewaySuccess = fee => ({
  type: GET_GATEWAY_FEE_SUCCESS,
  transactionType: ADS.TX_TYPES.GATEWAY,
  fee
});

export const getGatewayFailure = errorMsg => ({
  type: GET_GATEWAY_FEE_FAILURE,
  transactionType: ADS.TX_TYPES.GATEWAY,
  errorMsg
});

export const messageSent = message => ({
  type: MESSAGE_SENT,
  message
});
