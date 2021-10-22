import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  formValidationFailure,
  formValidationSuccess,
  GET_GATEWAY_FEE,
  getGatewayFailure,
  getGatewaySuccess,
  inputValidateFailure,
  inputValidateSuccess,
  signTransaction,
  TRANSACTION_ACCEPTED,
  transactionFailure,
  transactionSuccess,
  VALIDATE_FORM,
  VALIDATE_INPUT,
} from '../actions/transactionActions';
import { RpcError } from '../actions/errors';
import * as validators from '../utils/transactionValidators';
import ADS from '../utils/ads';
import { sanitizeHex, stringToHex } from '../utils/utils';

function sanitizeField(name, value, inputs) {
  switch (name) {
    case ADS.TX_FIELDS.AMOUNT:
      return ADS.strToClicks(value) || 0;
    case ADS.TX_FIELDS.MSG:
      if (inputs.rawMessage && !inputs.rawMessage.value) {
        return stringToHex(value);
      }
      return value;
    default:
      return value;
  }
}

export const prepareCommand = (transactionType, sender, inputs, time) => {
  const command = {};
  command[ADS.TX_FIELDS.TYPE] = transactionType === ADS.TX_TYPES.GATEWAY ?
    ADS.TX_TYPES.SEND_ONE :
    transactionType
  ;
  command[ADS.TX_FIELDS.SENDER] = sender.address;
  command[ADS.TX_FIELDS.MESSAGE_ID] = sender.messageId || '0';
  command[ADS.TX_FIELDS.TIME] = time ? new Date(time * 1000) : new Date();
  Object.keys(inputs).forEach((k) => {
    command[k] = sanitizeField(k, inputs[k].value, inputs);
  });
  return command;
};

export const prepareGatewayCommand = (gateway, sender, inputs, time) => {
  const address = sanitizeHex(inputs[ADS.TX_FIELDS.ADDRESS].value);
  const fields = {};
  fields[ADS.TX_FIELDS.ADDRESS] = { value: gateway.address };
  fields[ADS.TX_FIELDS.AMOUNT] = inputs[ADS.TX_FIELDS.AMOUNT];
  fields[ADS.TX_FIELDS.MSG] = { value: `${gateway.prefix}${address}` };
  return prepareCommand(ADS.TX_TYPES.SEND_ONE, sender, fields, time);
};

export const prepareTransaction = (transactionType, gateway, vault, inputs, time) => {
  const account = vault.accounts.find(a => a.address === vault.selectedAccount);
  const command = transactionType === ADS.TX_TYPES.GATEWAY ?
    prepareGatewayCommand(gateway, account, inputs, time) :
    prepareCommand(transactionType, account, inputs, time);
  const transactionData = ADS.encodeCommand(command);

  return [transactionType, account.hash || '0', transactionData];
};

const getInputErrorMsg = (transactionType, inputName, state, gateway) => {
  const { transactions } = state;
  const { inputs } = transactions[transactionType];
  const inputProps = inputs ? inputs[inputName] : null;
  if (!inputProps) {
    return 'Unknown error';
  }
  let errorMsg = null;
  if (!inputProps.noValid) {
    const validator = validators[inputName];
    if (!validator) {
      throw new Error(`No validator is defined for name ${inputName}`);
    }
    if (typeof inputProps.shown === 'undefined' || inputProps.shown === true) {
      errorMsg = validator({ value: inputProps.value, inputs, transactionType, gateway });
    }
  }
  return errorMsg;
};

const validateInput = (action, state) => {
  const { transactionType, inputName, gateway } = action;
  const errorMsg = getInputErrorMsg(transactionType, inputName, state, gateway);
  return errorMsg === null
    ? of(inputValidateSuccess(transactionType, inputName))
    : of(inputValidateFailure(transactionType, inputName, errorMsg));
};

const validateForm = (action, state, time) => {
  const { transactionType, gateway } = action;
  const { transactions, vault } = state;
  const { inputs } = transactions[transactionType];

  if (inputs) {
    const { isFormValid, actionsToDispatch } = Object.entries(inputs).reduce(
      (acc, [inputName]) => {
        const errorMsg = getInputErrorMsg(transactionType, inputName, state, gateway);
        const isInputValid = errorMsg === null;
        const actionToDispatch = isInputValid
          ? inputValidateSuccess(transactionType, inputName)
          : inputValidateFailure(transactionType, inputName, errorMsg);
        return {
          isFormValid: acc.isFormValid === false ? false : isInputValid,
          actionsToDispatch: [...acc.actionsToDispatch, actionToDispatch]
        };
      },
      { isFormValid: true, actionsToDispatch: [] }
    );

    return isFormValid
      ? of(
        ...actionsToDispatch,
        formValidationSuccess(transactionType),
        signTransaction(...prepareTransaction(transactionType, gateway, vault, inputs, time)),
      )
      : of(
        ...actionsToDispatch,
        formValidationFailure(transactionType)
      );
  }

  return of(formValidationFailure(transactionType));
};

const sendTransaction = (action, state, adsRpc) => {
  const { transactionType } = action;
  const { transactions, vault } = state;
  const tr = transactions[transactionType];

  const { nodeId } = ADS.splitAddress(vault.selectedAccount);
  const node = vault.nodes.find(n => n.id === nodeId);

  if (!node) {
    return of(transactionFailure(
      transactionType,
      `Cannot find node '${nodeId}'`
    ));
  }
  return from(adsRpc.sendTransaction(
    tr.transactionData,
    tr.signature,
    node.ipv4
  )).pipe(
    mergeMap(tx => of(transactionSuccess(
      transactionType,
      tx.id,
      tx.fee,
      tx.accountHash,
      tx.accountMessageId
    ))),
    catchError(error => of(transactionFailure(
      transactionType,
      error instanceof RpcError ? error.message : 'Unknown error'
    )))
  );
};

export const validateTransactionInputEpic = (action$, state$) => action$.pipe(
  ofType(VALIDATE_INPUT),
  withLatestFrom(state$),
  mergeMap(([action, state]) => validateInput(action, state))
);

export const validateTransactionFormEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(VALIDATE_FORM),
  withLatestFrom(state$),
  switchMap(([action, state]) => from(adsRpc.getTimestamp()).pipe(
    mergeMap(time => validateForm(action, state, time)),
    catchError(error => of(transactionFailure(
      action.transactionType,
      error instanceof RpcError ? error.message : 'Unknown error'
    )))
  ))
);

export const sendTransactionEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(TRANSACTION_ACCEPTED),
  withLatestFrom(state$),
  mergeMap(([action, state]) => sendTransaction(action, state, adsRpc))
);

export const getGatewayFeeEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(GET_GATEWAY_FEE),
  withLatestFrom(state$),
  switchMap(([action]) => from(adsRpc.getGatewayFee(
    action.gatewayCode,
    action.amount,
    action.address)
  ).pipe(
    mergeMap(fee => of(getGatewaySuccess(fee))),
    catchError(error => of(getGatewayFailure(
      error instanceof RpcError ? error.message : 'Unknown error'
    )))
  ))
);
