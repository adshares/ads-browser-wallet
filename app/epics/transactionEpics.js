import { ofType } from 'redux-observable';
import { of, from } from 'rxjs';
import { mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import {
  inputValidateSuccess,
  inputValidateFailure,
  formValidationSuccess,
  formValidationFailure,
  signTransaction,
  transactionSuccess,
  transactionFailure,
  VALIDATE_FORM,
  TRANSACTION_ACCEPTED,
} from '../actions/transactionActions';
import { RpcError } from '../actions/errors';
import * as validators from '../utils/transactionValidators';
import ADS from '../utils/ads';
import { stringToHex } from '../utils/utils';

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

export const prepareCommand = (transactionType, sender, inputs) => {
  const command = {};
  command[ADS.TX_FIELDS.TYPE] = transactionType;
  command[ADS.TX_FIELDS.SENDER] = sender.address;
  command[ADS.TX_FIELDS.MESSAGE_ID] = sender.messageId || '0';
  command[ADS.TX_FIELDS.TIME] = new Date();
  Object.keys(inputs).forEach((k) => {
    command[k] = sanitizeField(k, inputs[k].value, inputs);
  });

  return command;
};

export const prepareTransaction = (transactionType, vault, inputs) => {
  const account = vault.accounts.find(a => a.address === vault.selectedAccount);
  const command = prepareCommand(transactionType, account, inputs);
  const transactionData = ADS.encodeCommand(command);

  return [transactionType, account.hash || '0', transactionData];
};

const validateForm = (action, state) => {
  const { transactionType } = action;
  const { transactions, vault } = state;
  const { inputs } = transactions[transactionType];

  if (inputs) {
    const { isFormValid, actionsToDispatch } = Object.entries(inputs).reduce(
      (acc, [inputName, inputProps]) => {
        let errorMsg = null;
        if (!inputProps.noValid) {
          const validator = validators[inputName];
          if (!validator) {
            throw new Error(`No validator is defined for name ${inputName}`);
          }
          if (typeof inputProps.shown === 'undefined' || inputProps.shown === true) {
            errorMsg = validator({ value: inputProps.value, inputs, transactionType });
          }
        }
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
        signTransaction(...prepareTransaction(transactionType, vault, inputs)),
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

export const validateTransactionFormEpic = (action$, state$) => action$.pipe(
  ofType(VALIDATE_FORM),
  withLatestFrom(state$),
  mergeMap(([action, state]) => validateForm(action, state))
);

export const sendTransactionEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(TRANSACTION_ACCEPTED),
  withLatestFrom(state$),
  mergeMap(([action, state]) => sendTransaction(action, state, adsRpc))
);
