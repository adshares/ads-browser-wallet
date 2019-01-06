import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  mergeMap,
  switchMap,
  take,
  withLatestFrom,
  takeUntil,
} from 'rxjs/operators';

import * as vaultActions from '../actions/vaultActions';
import * as authActions from '../actions/walletActions';

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
    }),
    takeUntil(action$.pipe(
      ofType(authActions.CLEAN_AUTHORISATION_DIALOG_GLOBAL)
      )
    ),
    )
  ),
);

