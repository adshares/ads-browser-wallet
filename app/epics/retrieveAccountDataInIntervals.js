import { ofType } from 'redux-observable';
import { of, from, timer } from 'rxjs'; // works for RxJS v6
import { mergeMap, catchError, withLatestFrom, switchMap, mapTo, takeUntil } from 'rxjs/operators';
import { RpcError } from '../actions/errors';
import {
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS,
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP,
  retrieveAccountDataInIntervalsFailure,
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
              mergeMap(account => of(retrieveAccountDataInIntervalsSuccess(account))),
              catchError(error => of(retrieveAccountDataInIntervalsFailure(
                error instanceof RpcError ? error.message : 'Unknown error'
              )))
            )
        ),
        takeUntil(action$.pipe(
          ofType(RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP)
          )
        ),
      ),
  )
)
;


