import { ofType } from 'redux-observable';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { of, from } from 'rxjs';

import {
    inputValidateSuccess,
    inputValidateFailure,
    toggleAuthorisationDialog,
    ACCOUNT_EDIT_FORM_VALIDATE, accountEditFormValidationSuccess, accountEditFormValidationFailure
} from '../actions/form';

import { validatePagesBranch } from './helpers';
import { publicKey as publicKeyGeneralValidator } from '../utils/validators';
import config from '../config/config';
import ADS from '../utils/ads';
import { findAccountByAddressInVault, findAccountByNameInVault } from '../utils/utils';
import AccountEditorPage from '../containers/Settings/AccountEditorPage';

const validators = {
  publicKey: ({ value, vault, initialInputValues, inputs }) => {
  // jesli public key zostal zmieniony i znajduje sie w w innym account poinformuj
    if (initialInputValues.publicKey !== value && vault.accounts.find(a => a.publicKey === value)) {
      return 'You are trying reassign publicKey, which is already connected to different account';
    }

    return publicKeyGeneralValidator({ vault, value, inputs, pageName: AccountEditorPage.PAGE_NAME });
  },
  name: ({ value, vault, initialInputValues }) => {
    if (!value) {
      return 'Name cannot be empty';
    }

    if (initialInputValues.name !== value && findAccountByNameInVault(vault, value)) {
      return 'You are trying change address to one that is already defined';
    }
    if (vault.length > config.accountAndKeyNameMaxLength) {
      return `Given name ${value} is too long.`;
    }

    return null;
  },
  address: ({ value, vault, initialInputValues }) => {
    if (!value || !ADS.validateAddress(value)) {
      return 'Please provide an valid account address';
    }
    if (initialInputValues.address !== value && findAccountByAddressInVault(vault, value)) {
      return 'You are trying change address to one that is already defined';
    }

    return null;
  },
};

export default (action$, state$) =>
    action$.pipe(
        ofType(ACCOUNT_EDIT_FORM_VALIDATE),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
          const { pageName, initialInputValues } = action;
          const { vault, pages } = state;

          validatePagesBranch(pages, pageName);

          const { inputs } = pages[pageName];

          if (inputs) {
            const { isFormValid, actionsToDispatch } = Object.entries(inputs).reduce(
                (acc, [inputName, inputProps]) => {
                  const validator = validators[inputName];
                  let errorMsg = null;
                  if (!validator) {
                    throw new Error(`No validator is defined for name ${inputName}`);
                  }
                  if (typeof inputProps.shown === 'undefined' || inputProps.shown === true) {
                    errorMsg = validator({ value: inputProps.value, vault, inputs, pageName, initialInputValues });
                  }
                  const isInputValid = errorMsg === null;
                  const actionToDispatch = isInputValid
                    ? inputValidateSuccess(pageName, inputName)
                    : inputValidateFailure(pageName, inputName, errorMsg);
                  return {
                    isFormValid: acc.isFormValid === false ? false : isInputValid,
                    actionsToDispatch: [...acc.actionsToDispatch, actionToDispatch]
                  };
                },
                { isFormValid: true, actionsToDispatch: [] }
              );

            return isFormValid
                ? from([
                  ...actionsToDispatch,
                  toggleAuthorisationDialog(pageName, true),
                  accountEditFormValidationSuccess(pageName)
                ])
                : from([...actionsToDispatch, accountEditFormValidationFailure(pageName)]);
          }
          return of(accountEditFormValidationFailure(pageName));
        }),
    );
