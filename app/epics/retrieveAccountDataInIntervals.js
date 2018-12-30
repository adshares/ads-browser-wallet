import { ofType } from 'redux-observable';
import { of, from, timer } from 'rxjs'; // works for RxJS v6
import { mergeMap, catchError, withLatestFrom, switchMap } from 'rxjs/operators';
import { RpcError } from '../actions/errors';
import {
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS, retrieveAccountDataInIntervalsFailure,
  retrieveAccountDataInIntervalsSuccess
} from '../actions/actions';
import * as vaultActions from '../actions/vault';

export default (action$, state$, { adsRpc }) => action$.pipe(
  ofType(RETRIEVE_ACCOUNT_DATA_IN_INTERVALS, vaultActions.SELECT_ACTIVE_ACCOUNT),
  mergeMap(() =>
    timer(0, 5000)
      .pipe(
        withLatestFrom(state$),
        switchMap(([, state]) =>
          from(adsRpc.getAccount(state.vault.selectedAccount))
            .pipe(
              mergeMap((account) => {
                return of(retrieveAccountDataInIntervalsSuccess(account));
              }),
              catchError(error => of(retrieveAccountDataInIntervalsFailure(
                error instanceof RpcError ? error.message : 'Unknown error'
              )))
            )
        )
      )
  ),
);


