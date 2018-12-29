import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, mapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import * as vaultActions from '../actions/vault';
import * as authActions from '../actions/actions';
import { removeKey as removeKeyValidator } from '../utils/validators';

// TODO redirect to previous pages
export const cleanGlobalAuthDialog = action$ => action$.pipe(
  ofType(vaultActions.REMOVE_ACCOUNT, vaultActions.REMOVE_KEY, vaultActions.SAVE_GENERATED_KEYS),
  mapTo(authActions.cleanGlobalAuthorisationDialog())
);

export const removeKeyEpic = (action$, state$) => action$.pipe(
  ofType(vaultActions.REMOVE_KEY_INIT),
  switchMap(action => action$.pipe(
    ofType(authActions.GLOBAL_PASS_INPUT_VALIDATION_SUCCESS),
    take(1),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const { vault, authDialog } = state;

      const { secretKey } = action;
      // TODO display error message
      removeKeyValidator(secretKey);
      const updatedKeys = vault.keys
        .filter(key => key.secretKey !== secretKey);
      return of(vaultActions.removeKey(updatedKeys, authDialog.password.value));
    })
    )
  )
);

export const removeAccountEpic = (action$, state$) => action$.pipe(
  ofType(vaultActions.REMOVE_ACCOUNT_INIT),
  switchMap(action => action$.pipe(
    ofType(authActions.GLOBAL_PASS_INPUT_VALIDATION_SUCCESS),
    take(1),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const { vault, authDialog } = state;

      const { address } = action;
      const updatedAccounts = vault.accounts
        .filter(account => account.address !== address);
      return of(vaultActions.removeAccount(updatedAccounts, authDialog.password.value));
    })
    )
  )
);
export const saveGeneratedKeysEpic = (action$, state$) => action$.pipe(
  ofType(vaultActions.SAVE_GENERATED_KEYS_INIT),
  switchMap(action => action$.pipe(
    ofType(authActions.GLOBAL_PASS_INPUT_VALIDATION_SUCCESS),
    take(1),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const { authDialog, vault: {keyCount} } = state;
      const { keys } = action;
      const newKeyCount = keyCount + keys.length;
      return of(vaultActions.saveGeneratedKeys(keys, newKeyCount, authDialog.password.value));
    })
    )
  )
);
