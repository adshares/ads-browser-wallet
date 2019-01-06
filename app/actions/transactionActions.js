export const INPUT_CHANGED = 'TRANSACTIONS_INPUT_CHANGED';
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

export const inputChanged = (transactionType, inputName, inputValue) => ({
  type: INPUT_CHANGED,
  transactionType,
  inputName,
  inputValue
});

export const validateForm = transactionType => ({
  type: VALIDATE_FORM,
  transactionType
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

export const signTransaction = (transactionType, accountHash, transactionData) => ({
  type: SIGN_TRANSACTION,
  transactionType,
  accountHash,
  transactionData
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
